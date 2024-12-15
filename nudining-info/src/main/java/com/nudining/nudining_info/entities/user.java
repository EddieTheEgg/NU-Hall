package com.nudining.nudining_info.entities;

import jakarta.persistence.*;
import java.util.Map;

import org.hibernate.annotations.ColumnTransformer;



@Entity
@Table(name = "northeasternusers")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "dietary_restrictions", columnDefinition = "jsonb")
    @ColumnTransformer(write = "?::jsonb")
    private Map<String, Object> dietaryRestrictions;

    @Column(name="nutritional_focus", columnDefinition = "jsonb")
    @ColumnTransformer(write = "?::jsonb")
    private Map<String, Object> nutritionalFocus;
    
    //Constructor(s)
    public User(String name, String password, String email, Map<String, Object> dietaryRestrictions, Map<String, Object> nutritionalFocus) {
        this.name = name;
        this.password = password;
        this.email = email;
        this.dietaryRestrictions = dietaryRestrictions;
        this.nutritionalFocus = nutritionalFocus;
    }

    //User Methods

    //ID
    public Long getID() {
        return this.id;
    }
    public void setID(Long id){
        this.id = id;
    }

    //Name
    public String getName() {
        return this.name;
    }
    public void setName(String newName) {
        this.name = newName;
    }

    //Email
    public String getEmail(){
        return this.email;
    }
    public void setEmail(String newEmail){
        this.email = newEmail;
    }
    
    //Password
    public String getPassword() {
        return this.password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    //Dietary Restrictions
    public Map<String, Object> getDietaryRestrictions() {
        return this.dietaryRestrictions;
    }
    public void setDietaryRestrictions(Map<String, Object> newDietaryRestrictions) {
        this.dietaryRestrictions = newDietaryRestrictions;
    }

    //Nutrition Focus
    public Map<String, Object> getNutritionalFocus() {
        return this.nutritionalFocus;
    }
    public void setNutritionalFocus(Map<String, Object> newNutritionalFocus){
        this.nutritionalFocus = newNutritionalFocus;
    }


}



