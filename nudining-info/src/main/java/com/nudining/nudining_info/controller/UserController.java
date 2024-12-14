package com.nudining.nudining_info.controller;

import com.nudining.nudining_info.entities.User;
import com.nudining.nudining_info.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users") // Changed to /users for clarity
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
    
    //Find user by ID
    @GetMapping("/getUser/{id}")
    public User getUserById(@PathVariable Long id){
        return userService.findUserByID(id)
            .orElseThrow(() -> new RuntimeException("User not found with given id"));
    }



} 