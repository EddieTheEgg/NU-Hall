package com.nudining.nudining_info.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.annotation.Async;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.io.File;

@Component
public class DailyDataScheduler {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Scheduled(cron = "0 * * * * ?") // Run at midnight every day
    public void fetchAndImportData() {
        try {
            String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-M-d"));

            CompletableFuture<Void> pythonScriptFuture = runPythonScriptAsync(currentDate);

            pythonScriptFuture.thenRun(() -> {
                System.out.println("Python script executed successfully. Proceeding with data import.");
                // Alter the columns before truncating the table and importing data
                alterTableColumns();

                importCsvToPostgres("/Users/edisonkwok/Documents/cs1200/NU-Hall/nudining-info/Data/FetchDailyMenu/" + currentDate + ".csv");
            }).exceptionally(ex -> {
                System.err.println("Error during Python script execution: " + ex.getMessage());
                return null;
            });

        } catch (Exception e) {
            System.err.println("Error during data fetch and import: " + e.getMessage());
        }
    }

    @Async
    public CompletableFuture<Void> runPythonScriptAsync(String currentDate) {
        return CompletableFuture.runAsync(() -> {
            try {
                System.out.println("Running Python script with date: " + currentDate);
                String scriptPath = "Data/FetchDailyMenu/dataConverter.py";
                ProcessBuilder processBuilder = new ProcessBuilder("python3", scriptPath, currentDate); //ProcessBuilder: Run commands in terminal
                processBuilder.directory(new File(System.getProperty("user.dir"))); // Sets the scriptPath directory above to correct directory
                processBuilder.redirectErrorStream(true); 

                Process process = processBuilder.start();
                int exitCode = process.waitFor();

                BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println(line);
                }

                if (exitCode != 0) {
                    System.err.println("Python script execution failed with exit code: " + exitCode);
                } else {
                    System.out.println("Python script executed successfully.");
                    // Check if the file was created
                    String filePath = "/Users/edisonkwok/Documents/cs1200/NU-Hall/nudining-info/Data/FetchDailyMenu/" + currentDate + ".csv";
                    File createdFile = new File(filePath);
                    if (createdFile.exists()) {
                        System.out.println("File created successfully: " + createdFile.getAbsolutePath());
                    } else {
                        System.err.println("File not found: " + createdFile.getAbsolutePath());
                    }
                }
            } catch (Exception e) {
                System.err.println("Error executing Python script: " + e.getMessage());
            }
        });
    }

    public void alterTableColumns() {
        String alterIngredientsColumn = "ALTER TABLE daily_menu ALTER COLUMN ingredients TYPE TEXT;";
        String alterDescriptionColumn = "ALTER TABLE daily_menu ALTER COLUMN description TYPE TEXT;";

        try {
            jdbcTemplate.update(alterIngredientsColumn);
            jdbcTemplate.update(alterDescriptionColumn);
            System.out.println("Columns 'ingredients' and 'description' successfully altered to TEXT type.");
        } catch (Exception e) {
            System.err.println("Error altering table columns: " + e.getMessage());
        }
    }

    public void importCsvToPostgres(String filePath) {
        String truncateSql = "TRUNCATE TABLE daily_menu RESTART IDENTITY CASCADE;";
        String absoluteFilePath = new java.io.File(filePath).getAbsolutePath();

        try {
            jdbcTemplate.update(truncateSql);
            System.out.println("Old data truncated from the daily_menu table.");

            System.out.println("Expected CSV file path: " + filePath);

            // Check if the CSV file exists with a timeout
            int attempts = 0;
            while (!new java.io.File(filePath).exists() && attempts < 12) { 
                System.out.println("Waiting for the CSV file to be created at " + filePath + "...");
                TimeUnit.SECONDS.sleep(5);  
                attempts++;
            }

            if (!new java.io.File(filePath).exists()) {
                System.err.println("CSV file was not created within the expected time frame.");
                return;
            }

            String command = String.format("psql -U postgres -d DailyMenu -c \"\\copy daily_menu(location, period, kitchen, dish_name, description, portion, ingredients, calories, protein, carbohydrates, sugar, fat, saturated_fat, cholesterol, dietary_fiber, sodium, potassium, calcium, iron, trans_fat, vitamin_d, vitamin_c, calories_from_fat, vitamin_a, saturated_trans_fat, allergens) FROM '%s' WITH (FORMAT CSV, HEADER);\"",
                    absoluteFilePath);

            System.out.println("Executing command: " + command);  

            ProcessBuilder processBuilder = new ProcessBuilder("bash", "-c", command);
            processBuilder.redirectErrorStream(true); // Redirect error stream to output

            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);  
            }

            int exitCode = process.waitFor();

            if (exitCode == 0) {
                System.out.println("Data successfully imported into PostgreSQL.");
            } else {
                System.err.println("Error importing data into PostgreSQL. Exit code: " + exitCode);
            }
        } catch (IOException | InterruptedException e) {
            System.err.println("Error executing PostgreSQL command: " + e.getMessage());
        }
    }
}
