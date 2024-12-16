package com.nudining.nudining_info.entities;


import java.util.ArrayList;


public class GenerateMealsRequest {
    private User user; //We will always have user information sent to intiliaze this for each instance
    private ArrayList<String> periods;
    private ArrayList<String> locations;
    private ArrayList<String> kitchens;

    public GenerateMealsRequest(User user, ArrayList<String> periods, ArrayList<String> locations, ArrayList<String> kitchens){
        this.user = user;
        this.periods = periods;
        this.locations = locations;
        this.kitchens = kitchens;
    }

    //Methods

    //user
    public User getUser(){
        return user;
    }
    public void setUser(User newUserInfo){
        this.user = newUserInfo;
    }

    //periods
    public ArrayList<String> getPeriods(){
        return periods;
    }
    public void setPeriods(ArrayList<String> newPeriods){
        this.periods = newPeriods;
    }

    //locations
    public ArrayList<String> getLocations(){
        return locations;
    }
    public void setLocations(ArrayList<String> newLocations){
        this.locations = newLocations;
    }

    //kitchens
    public ArrayList<String> getKitchens(){
        return kitchens;
    }
    public void setKitchesn(ArrayList<String> newKitchens){
        this.kitchens = newKitchens;
    }
}




