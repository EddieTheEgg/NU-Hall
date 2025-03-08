package com.nudining.nudining_info.controller;

import com.nudining.nudining_info.entities.User;
import com.nudining.nudining_info.entities.Range;
import com.nudining.nudining_info.service.UserService;
import com.nudining.nudining_info.entities.UserLoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    //User Methods:

    //Create Users
    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/addUser")
    public User addUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    //Update User
    @CrossOrigin(origins = "http://localhost:5173")
    @PutMapping("/update/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        try {
            Optional<User> existingUser = userService.findUserByID(id);
            if (existingUser.isPresent()) {
                User user = existingUser.get();
                user.setName(updatedUser.getName());
                user.setEmail(updatedUser.getEmail());
                //typically when updating, the password would not be saved in frontend so its null.
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    user.setPassword(updatedUser.getPassword());
                }
                User savedUser = userService.saveUser(user);
                return ResponseEntity.ok(savedUser);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error updating user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/verify/{id}")
    public boolean verifyPassword(@PathVariable Long id, @RequestBody String potentialVerifyPassword) {
        String password = potentialVerifyPassword.replaceAll("^\"|\"$", ""); 
        
        Optional<User> existingUser = userService.findUserByID(id);
        if (!existingUser.isPresent()) {
            return false;
        }
        //Convert backend pass to a string in case...
        String backendPassword = new String(existingUser.get().getPassword());
        
        if (backendPassword.equals(password)) {
            return true;
        }
        return false;
    }

    
    //Find user by ID
    @GetMapping("/getUserById/{id}")
    @CrossOrigin(origins = "http://localhost:5173")
    public User getUserById(@PathVariable Long id){
        return userService.findUserByID(id)
            .orElseThrow(() -> new RuntimeException("User not found with given id"));
    }

    //Find user by email
    @GetMapping("/getUserByEmail/{email}")
    @CrossOrigin(origins = "http://localhost:5173")
    public User getUserByEmail(@PathVariable String email) {
        return userService.findUserByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with given email"));
    }

    //Validate user attempt with login
    @PostMapping("/login")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<User> login(@RequestBody UserLoginRequest loginRequest) {
        String email = loginRequest.getEmail().trim();
        String password = loginRequest.getPassword().trim();
        
        Optional<User> user = userService.findUserByEmail(email);
        
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return ResponseEntity.ok(user.get()); 
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    @PutMapping("/updateNutritionFocus/{email}")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<User> updateNutritionFocusByEmail(
            @PathVariable String email,
            @RequestBody Map<String, Map<String, Double>> focusMap) {
    
        Optional<User> userOptional = userService.findUserByEmail(email);
                
        System.out.println(userOptional);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    
        User user = userOptional.get();
    
        Map<String, Range> updatedFocus = focusMap.entrySet() //converts to Map.Entry("Nutrient", {min: double, "max": double})
                                                    .stream() //converts the map.entry to actual elements of an array for iteration
                                                    .collect(Collectors.toMap( //Convert the stream back into a map
                                                                    Map.Entry::getKey, 
                                                                    entry -> new Range(entry.getValue().get("min"), entry.getValue().get("max"))
                                                            ));
        
        user.setNutritionalFocus(updatedFocus); 
        User updatedUser = userService.saveUser(user);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/updateDietaryRestrictions/{email}")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<User> updateDietaryRestrictionByEmail(
            @PathVariable String email,
            @RequestBody Map<String, Object> newDietaryRestrictions) {
                Optional<User> userOptional = userService.findUserByEmail(email);
                
                System.out.println(userOptional);
        
                if (userOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
                }
            
                User user = userOptional.get();
                user.setDietaryRestrictions(newDietaryRestrictions);
                System.out.println(newDietaryRestrictions);
                User updatedUser = userService.saveUser(user);
                return ResponseEntity.ok(updatedUser);
            }
    
} 