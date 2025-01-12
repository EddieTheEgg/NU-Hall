package com.nudining.nudining_info.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table; 

@Entity
@Table(name = "daily_menu")
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // This generates a unique ID for each Meal
    private Long id; // This is the primary key for the Meal entity
    
    private String location;
    private String period;
    private String kitchen;
    private String dishName;
    private String description;
    private String portion;       // Portion size of dish
    private String ingredients;   // List of Ingredients
    private Float calories;           
    private Float protein;              
    private Float carbohydrates; 
    private Float sugar;
    private Float fat;
    private Float saturated_fat;
    private Float cholesterol;
    private Float dietary_fiber;
    private Float sodium;
    private Float potassium;
    private Float calcium;
    private Float iron;
    private Float trans_fat;
    private Float vitamin_d;
    private Float vitamin_c;
    private Float calories_from_fat;
    private Float vitamin_a;
    private Float saturated_trans_fat;
    private String allergens;

    // Default constructor
    public Meal() {
    }

    // Custom constructor
    public Meal(String period, String location, String kitchen, String dishName, String description) {
        this.period = period;
        this.location = location;
        this.kitchen = kitchen;
        this.dishName = dishName;
        this.description = description;
    }

    // Getters and Setters

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getKitchen() {
        return kitchen;
    }

    public void setKitchen(String kitchen) {
        this.kitchen = kitchen;
    }

    public String getDishName() {
        return dishName;
    }

    public void setDishName(String dishName) {
        this.dishName = dishName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPortion() {
        return portion;
    }

    public void setPortion(String portion) {
        this.portion = portion;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public Float getCalories() {
        return calories;
    }

    public void setCalories(Float calories) {
        this.calories = calories;
    }

    public Float getProtein() {
        return protein;
    }

    public void setProtein(Float protein) {
        this.protein = protein;
    }

    public Float getCarbohydrates() {
        return carbohydrates;
    }

    public void setCarbohydrates(Float carbohydrates) {
        this.carbohydrates = carbohydrates;
    }

    public Float getSugar() {
        return sugar;
    }

    public void setSugar(Float sugar) {
        this.sugar = sugar;
    }

    public Float getFat() {
        return fat;
    }

    public void setFat(Float fat) {
        this.fat = fat;
    }

    public Float getSaturatedFat() {
        return saturated_fat;
    }

    public void setSaturatedFat(Float saturated_fat) {
        this.saturated_fat = saturated_fat;
    }

    public Float getCholesterol() {
        return cholesterol;
    }

    public void setCholesterol(Float cholesterol) {
        this.cholesterol = cholesterol;
    }

    public Float getDietaryFiber() {
        return dietary_fiber;
    }

    public void setDietaryFiber(Float dietary_fiber) {
        this.dietary_fiber = dietary_fiber;
    }

    public Float getSodium() {
        return sodium;
    }

    public void setSodium(Float sodium) {
        this.sodium = sodium;
    }

    public Float getPotassium() {
        return potassium;
    }

    public void setPotassium(Float potassium) {
        this.potassium = potassium;
    }

    public Float getCalcium() {
        return calcium;
    }

    public void setCalcium(Float calcium) {
        this.calcium = calcium;
    }

    public Float getIron() {
        return iron;
    }

    public void setIron(Float iron) {
        this.iron = iron;
    }

    public Float getTransFat() {
        return trans_fat;
    }

    public void setTransFat(Float trans_fat) {
        this.trans_fat = trans_fat;
    }

    public Float getVitaminD() {
        return vitamin_d;
    }

    public void setVitaminD(Float vitamin_d) {
        this.vitamin_d = vitamin_d;
    }

    public Float getVitaminC() {
        return vitamin_c;
    }

    public void setVitaminC(Float vitamin_c) {
        this.vitamin_c = vitamin_c;
    }

    public Float getCaloriesFromFat() {
        return calories_from_fat;
    }

    public void setCaloriesFromFat(Float calories_from_fat) {
        this.calories_from_fat = calories_from_fat;
    }

    public Float getVitaminA() {
        return vitamin_a;
    }

    public void setVitaminA(Float vitamin_a) {
        this.vitamin_a = vitamin_a;
    }

    public Float getSaturatedTransFat() {
        return saturated_trans_fat;
    }

    public void setSaturatedTransFat(Float saturated_trans_fat) {
        this.saturated_trans_fat = saturated_trans_fat;
    }

    public String getAllergens() {
        return allergens;
    }

    public void setAllergens(String allergens) {
        this.allergens = allergens;
    }
}
