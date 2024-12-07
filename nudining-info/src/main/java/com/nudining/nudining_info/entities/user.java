package com.nudining.nudining_info.entities;

import java.util.ArrayList;

public class User {
    private String name;
    private ArrayList<String> dietaryRestrictions;
    private ArrayList<String> nutritionalFocus;


    public User(String name, ArrayList<String> dietaryRestrictions, ArrayList<String> nutritionalFocus){
        this.name = name;
        this.dietaryRestrictions = dietaryRestrictions;
        this.nutritionalFocus = nutritionalFocus;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String newName) {
        this.name = newName;
    }

    public ArrayList<String> getDietaryRestrictions(){
        return this.dietaryRestrictions;
    }
    public void addDietaryRestrictions(String newDietaryRestriction){
        this.dietaryRestrictions.add(newDietaryRestriction);
    }

    public void removeDietaryRestrictions(String dietaryRestriction){
        this.dietaryRestrictions.remove(dietaryRestriction);
    }

    public ArrayList<String> getNutritionalTypes(){
        return this.nutritionalFocus;
    }

    public void addNutritionalType(String nutritionalType){
        this.nutritionalFocus.add(nutritionalType);
    }

    



    
}



