package com.nudining.nudining_info.service;

 // Heres where data that was retrieved gets manipulated!
import com.nudining.nudining_info.entities.Meal;
import com.nudining.nudining_info.entities.User;
import com.nudining.nudining_info.repository.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class MealService {

    @Autowired
    private MealRepository mealRepository;

    public ArrayList<Meal> generatePotentialMeals(User user, ArrayList<String> periods, ArrayList<String> locations, ArrayList<String> kitchens) {
        ArrayList<Meal> filteredMeals = mealRepository.findMealsByPeriodsLocationsKitchens(periods, locations, kitchens);
        
        // Filter out meals that contain any of the user's allergens
        filteredMeals.removeIf(meal -> meal.getAllergens().stream()
            .anyMatch(allergen -> user.getDietaryRestrictions().contains(allergen)));

        return filteredMeals; 
    }

    public List<Meal> getMealsByNutrientValues(Float maxCalories, Float minProtein) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getMealsByNutrientValues'");
    }

    public List<Meal> getMealsByLocationAndPeriod(String location, String period) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getMealsByLocationAndPeriod'");
    }

    public List<Meal> recommendMealsBasedOnNutritionalValues(User user, ArrayList<Meal> potentialMeals, Float maxCalories, Float maxFat, Float minVitaminD) {
        // Filter meals based on user nutritional preferences
        return potentialMeals.stream()
            .filter(meal -> (maxCalories == null || meal.getCalories() <= maxCalories) &&
                            (maxFat == null || meal.getFat() <= maxFat) &&
                            (minVitaminD == null || meal.getVitaminD() >= minVitaminD))
            .collect(Collectors.toList());
    }
} 