package com.nudining.nudining_info.entities;

import jakarta.persistence.*;
import java.util.ArrayList;

@Entity
@Table(name = "northeasternUsers")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ElementCollection
    private ArrayList<String> dietaryRestrictions;
    @ElementCollection
    private ArrayList<Nutrition> nutritionalFocus;
    private String password;

    public User() {}

    public User(String name, String password, ArrayList<String> dietaryRestrictions, ArrayList<Nutrition> nutritionalFocus) {
        this.name = name;
        this.password = password;
        this.dietaryRestrictions = dietaryRestrictions;
        this.nutritionalFocus = nutritionalFocus;
    }

    //Name: (String)
    public String getName() {
        return this.name;
    }
    public void setName(String newName) {
        this.name = newName;
    }

    //Password: (String)
    public String getPassword() {
        return this.password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    //Dietary Restrictions: (List of Dietary Strings)
    public ArrayList<String> getDietaryRestrictions(){
        return this.dietaryRestrictions;
    }
    public void addDietaryRestrictions(String newDietaryRestriction){
        this.dietaryRestrictions.add(newDietaryRestriction);
    }
    public void removeDietaryRestrictions(String dietaryRestriction){
        this.dietaryRestrictions.remove(dietaryRestriction);
    }

    //User Nutritions: (List of Nutritions, which include the type of nutrition, and the range for each)
    public ArrayList<Nutrition> getUserNutritions(){
        return this.nutritionalFocus;
    }
    public void setUserNutrition(Nutrition updatedNutrition){
        
    }


}



