package com.nudining.nudining_info.controller;

import com.nudining.nudining_info.entities.Meal;
import com.nudining.nudining_info.entities.User;
import com.nudining.nudining_info.service.MealService;
import com.nudining.nudining_info.entities.GenerateMealsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meals")
public class MealController {

    @Autowired
    private MealService mealService;

    //Purpose:
     //Actual valid list of meals we can use so later user can add these dishes in if they dont like the recommendation
     @CrossOrigin(origins = "http://localhost:5173")
     @PostMapping("/generatePotentialMeals")
    public ResponseEntity<List<Meal>> generatePotentialmeals(@RequestBody GenerateMealsRequest request){
        try{
            //Extract the JSON-> Java information from the inputted request
            User user = request.getUser();
            Map<String, Object> dietaryRestrictions = user.getDietaryRestrictions(); // Get dietary restrictions

            //Extract other temporary fields not saved to database but currently selected by user
            ArrayList<String> periods = request.getPeriods();
            ArrayList<String> locations = request.getLocations();
            ArrayList<String> kitchens = request.getKitchens();

            //Validate Inputs
            if (periods == null || locations == null || kitchens == null) {
                return ResponseEntity.badRequest().body(null);
            }

            List<Meal> meals = mealService.generatePotentialMeals(user, periods, locations, kitchens, dietaryRestrictions);
            
            return ResponseEntity.ok(meals); //Returns a JSON list of valid meals for user to select/edit with
            } catch (Exception e){
                System.err.println("Error generating meals: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
    }
    
    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/kitchens/{period}/{location}")
    public ResponseEntity<List<String>> getUniqueKitchens(
            @PathVariable String period,
            @PathVariable String location) {
        try {
            List<String> kitchens = mealService.getUniqueKitchensByPeriodAndLocation(period, location);
            return ResponseEntity.ok(kitchens);
        } catch (Exception e) {
            System.err.println("Error fetching unique kitchens: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}


    // Purpose:
    // Generate a list of recommended meals for each period, location, and kitchen.
    /*
     * 
     
    @PostMapping("/generateRecommendedMeals")
    public ResponseEntity<List<Meal>> generateRecommendedMeals(@RequestBody GenerateMealsRequest request) {
        try {
            // Extract the user and their preferences
            User user = request.getUser();
            Map<String, Range> nutritionalFocus = user.getNutritionalFocus(); // Get nutritional focus
            Map<String, Object> dietaryRestrictions = user.getDietaryRestrictions(); // Get dietary restrictions

            // Extract other fields not saved in the database but currently selected by the user
            ArrayList<String> periods = request.getPeriods();
            ArrayList<String> locations = request.getLocations();
            ArrayList<String> kitchens = request.getKitchens();

            // Validate inputs
            if (periods == null || locations == null || kitchens == null) {
                return ResponseEntity.badRequest().body(null);
            }

            // Generate potential meals based on the user's restrictions and preferences
            List<Meal> validPotentialMeals = mealService.generatePotentialMeals(user, periods, locations, kitchens, dietaryRestrictions);
            
            // Generate recommended meals based on the combination of periods, locations, and kitchens
            //Might move all this into geenrateRecomendMeal inside mealService instead!!!
            List<Meal> recommendedMeals = new ArrayList<>();
            for (String period : periods) {
                for (String location : locations) {
                        // Select a recommended meal for this combination
                        Meal recommendedMeal = mealService.generateRecommendedMeal(period, location, validPotentialMeals);
                        recommendedMeals.add(recommendedMeal);
                    
                }
            }

            // Return the list of recommended meals
            return ResponseEntity.ok(recommendedMeals);
        } catch (Exception e) {
            System.err.println("Error generating recommended meals: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    }
    */