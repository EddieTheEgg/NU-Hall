package com.nudining.nudining_info.repository;

import com.nudining.nudining_info.entities.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {

    // Get unique meal periods (Breakfast, Lunch, Dinner)
    @Query("SELECT DISTINCT m.period FROM Meal m")
    List<String> findDistinctPeriods();

    // Get unique meal locations (e.g., Stetson East, Stetson West)
    @Query("SELECT DISTINCT m.location FROM Meal m")
    List<String> findDistinctLocations();

    // Get unique meal kitchens (e.g., Homestyle, Rice Station)
    @Query("SELECT DISTINCT m.kitchen FROM Meal m")
    List<String> findDistinctKitchens();
}
