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
import java.util.Map;

@Service
public class MealService {

    @Autowired
    private MealRepository mealRepository;

    public ArrayList<Meal> generatePotentialMeals(User user, ArrayList<String> periods, ArrayList<String> locations, ArrayList<String> kitchens) {
        ArrayList<Meal> filteredMeals = mealRepository.findMealsByPeriodsLocationsKitchens(periods, locations, kitchens);
        
        Map<String, Object> userDietaryRestrictions = user.getDietaryRestrictions();
    
        if (userDietaryRestrictions != null) {
            // Extract restrictions

            
            List<String> allergies = (List<String>) userDietaryRestrictions.getOrDefault("allergies", new ArrayList<>());
            List<String> proteinPreferences = (List<String>) userDietaryRestrictions.getOrDefault("proteinPreferences", new ArrayList<>());
            List<String> lifestylePreferences = (List<String>) userDietaryRestrictions.getOrDefault("lifestylePreferences", new ArrayList<>());
            List<String> unwantedIngredients = (List<String>) userDietaryRestrictions.getOrDefault("unwantedIngredients", new ArrayList<>());
            
            // Filter meals (Final filtering)
            filteredMeals.removeIf(meal -> {

                // Check Lifestyle Preferences (e.g., Vegetarian, Vegan)
                if (!lifestylePreferences.isEmpty()) {
                    for (String preference : lifestylePreferences) {
                        if (!meal.getAllergens().contains(preference)) {
                            return true; // Exclude if meal does not adhere to lifestyle preference
                        }
                    }
                }
                
                // Check Allergens
                if (allergies.stream().anyMatch(allergen -> meal.getAllergens().contains(allergen))) {
                    return true; // Exclude meal if any allergen matches
                }
    
                // Check Protein Preferences (avoid certain ingredients like 'Beef', 'Pork')
                if (proteinPreferences.stream().anyMatch(preference -> meal.getIngredients().contains(preference))) {
                    return true; // Exclude meal if any unwanted protein is found
                }
    
                // Check Unwanted Ingredients
                if (unwantedIngredients.stream().anyMatch(ingredient -> meal.getIngredients().contains(ingredient))) {
                    return true; // Exclude meal if unwanted ingredient is found
                }
    
                return false; 
            });
        }
    
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