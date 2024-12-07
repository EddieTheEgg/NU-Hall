package com.nudining.nudining_info.service;

import com.nudining.nudining_info.entities.Meal;
import com.nudining.nudining_info.entities.User;
import com.nudining.nudining_info.repository.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
public class MealService {

    @Autowired
    private MealRepository mealRepository;

    public ArrayList<Meal> generatePotentialMeals(User user, ArrayList<String> periods, ArrayList<String>locations, ArrayList<String> kitchens){
        ArrayList<Meal> filteredMeals = mealRepository.findMealsByPeriodsLocationsKitchens(periods, locations, kitchens);
        

    return filteredMeals; //Need to filter out the allergies and necessary columns
    }

    public List<Meal> getMealsByNutrientValues(Float maxCalories, Float minProtein) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getMealsByNutrientValues'");
    }

    public List<Meal> getMealsByLocationAndPeriod(String location, String period) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getMealsByLocationAndPeriod'");
    }
} 