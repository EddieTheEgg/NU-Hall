package com.nudining.nudining_info.repository;

import com.nudining.nudining_info.entities.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {

    @Query("SELECT m FROM Meal m WHERE m.period IN (:periods) AND m.location IN (:locations) AND m.kitchen IN (:kitchens)")
    ArrayList<Meal> findMealsByPeriodsLocationsKitchens(
        @Param("periods") ArrayList<String> periods, 
        @Param("locations") ArrayList<String> locations, 
        @Param("kitchens") ArrayList<String> kitchens
    );
    
    @Query("SELECT DISTINCT m.kitchen FROM Meal m WHERE m.period = :period AND m.location = :location")
    ArrayList<String> findUniqueKitchensByPeriodAndLocation(
        @Param("period") String period,
        @Param("location") String location
    );
    
}
