package com.nudining.nudining_info.controller;

import com.nudining.nudining_info.entities.Meal;
import com.nudining.nudining_info.entities.User;
import com.nudining.nudining_info.service.MealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/meals")
public class MealController {

    @Autowired
    private MealService mealService;

    @PostMapping("/generate")
    public ArrayList<Meal> generatePotentialMeals(
            @RequestBody User user,
            @RequestParam ArrayList<String> periods,
            @RequestParam ArrayList<String> locations,
            @RequestParam ArrayList<String> kitchens) {
        
        return mealService.generatePotentialMeals(user, periods, locations, kitchens);
    }
}