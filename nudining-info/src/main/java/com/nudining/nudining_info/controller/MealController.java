package com.nudining.nudining_info.controller;

import com.nudining.nudining_info.entities.Meal;
import com.nudining.nudining_info.entities.User;
import com.nudining.nudining_info.service.MealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/meals")
public class MealController {

    @Autowired
    private MealService mealService;

    @PostMapping("/addUser")
    public User addUser(@RequestBody User user) {
                    
        return user;
    }

    @PostMapping("/generate")
    public ArrayList<Meal> generatePotentialMeals(
            @RequestBody User user,
            @RequestParam ArrayList<String> periods,
            @RequestParam ArrayList<String> locations,
            @RequestParam ArrayList<String> kitchens) {
        
        return mealService.generatePotentialMeals(user, periods, locations, kitchens);
    }

    @PostMapping("/recommend")
    public List<Meal> recommendMeals(
            @RequestBody User user,
            @RequestParam ArrayList<String> periods,
            @RequestParam ArrayList<String> locations,
            @RequestParam ArrayList<String> kitchens,
            @RequestParam(required = false) Float maxCalories,
            @RequestParam(required = false) Float maxFat,
            @RequestParam(required = false) Float minVitaminD) {
        
        // Generate potential meals first
        ArrayList<Meal> potentialMeals = mealService.generatePotentialMeals(user, periods, locations, kitchens);
        
        // Get recommended meals based on nutritional values
        return mealService.recommendMealsBasedOnNutritionalValues(user, potentialMeals, maxCalories, maxFat, minVitaminD);
    }
}