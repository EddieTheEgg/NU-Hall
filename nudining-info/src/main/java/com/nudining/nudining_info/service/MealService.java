package com.nudining.nudining_info.service;

 // Heres where data that was retrieved gets manipulated!
import com.nudining.nudining_info.entities.Meal;
import com.nudining.nudining_info.entities.User;
import com.nudining.nudining_info.repository.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;

@Service
public class MealService {

    @Autowired
    private MealRepository mealRepository;

    //Main Function: Generates valid potential meals
    public List<Meal> generatePotentialMeals(User user, ArrayList<String> periods, ArrayList<String> locations, ArrayList<String> kitchens, Map<String, Object> dietaryRestrictions) {
   
        List<Meal> potentialValidMeals = mealRepository.findMealsByPeriodsLocationsKitchens(periods, locations, kitchens);

        // Apply dietary restrictions if available
        Map<String, Object> userDietaryRestrictions = user.getDietaryRestrictions();
        if (userDietaryRestrictions != null) {
            filterMealsByDietaryRestrictions(potentialValidMeals, userDietaryRestrictions);
        }

        return potentialValidMeals;
    }


    private void filterMealsByDietaryRestrictions(List<Meal> potentialMeals, Map<String, Object> dietaryRestrictions) {
        @SuppressWarnings("unchecked")
        List<String> allergies = (List<String>) dietaryRestrictions.getOrDefault("allergies", new ArrayList<>());
        @SuppressWarnings("unchecked")
        List<String> proteinPreferences = (List<String>) dietaryRestrictions.getOrDefault("proteinPreferences", new ArrayList<>());
        @SuppressWarnings("unchecked")
        List<String> lifestylePreferences = (List<String>) dietaryRestrictions.getOrDefault("lifestylePreferences", new ArrayList<>());
        @SuppressWarnings("unchecked")
        List<String> unwantedIngredients = (List<String>) dietaryRestrictions.getOrDefault("unwantedIngredients", new ArrayList<>());

        potentialMeals.removeIf(meal -> 
            matchesLifestylePreferences(meal, lifestylePreferences) ||
            containsAllergens(meal, allergies) ||
            containsUnwantedProtein(meal, proteinPreferences) ||
            containsUnwantedIngredients(meal, unwantedIngredients)
        );
    }


    // Helper Functions for filterMealsByDietaryRestrictions

    //Return true if meal is invalid, Return false if meal is valid
    private boolean matchesLifestylePreferences(Meal meal, List<String> userLifestylePreferences) {
        if (userLifestylePreferences.isEmpty()) {
            return false; 
        }

        for (String userLifestylePreference : userLifestylePreferences) {
            if (meal.getAllergens().contains(userLifestylePreference)) {
                return false; // Keep the meal if it matches the user's preference (Vegan, Vegetarian)
            }
        }
        
        return true;
    }
   
    private boolean containsAllergens(Meal meal, List<String> userAllergens) {
        if (userAllergens.isEmpty()) {
            return false;
        }

        //Convert's a meal's allergy (String type -> List) for gluten handling
        List<String> mealAllergens = Arrays.asList(meal.getAllergens().split(","));

        for (String userAllergen : userAllergens) {
            // Special gluten handling
            if ("Gluten".equals(userAllergen) && mealAllergens.contains("Gluten")) {
                return true; 
            }
            if ("Gluten".equals(userAllergen) && mealAllergens.contains("Avoiding Gluten")) {
                return false;
            }
            if (meal.getAllergens().contains(userAllergen)) {
                return true; 
            }
        }
        return false; 
    }


    private boolean containsUnwantedProtein(Meal meal, List<String> userUnwantedProteins) {
        if (userUnwantedProteins.isEmpty()) {
            return false;
        }
    
        List<String> mealIngredients = Arrays.asList(meal.getIngredients().split(","));
    
        for (String userUnwantedProtein : userUnwantedProteins) {
            if (mealIngredients.contains(userUnwantedProtein)) {
                return true;
            }
        }
        return false; 
    }

    private boolean containsUnwantedIngredients(Meal meal, List<String> userUnwantedIngredients) {
        if (userUnwantedIngredients.isEmpty()) {
            return false;
        }
    
        List<String> mealIngredients = Arrays.asList(meal.getIngredients().split(","));
    
        for (String userUnwantedIngredient : userUnwantedIngredients) {
            if (mealIngredients.contains(userUnwantedIngredient)) {
                return true; // 
            }
        }
        return false; 
    }
} 