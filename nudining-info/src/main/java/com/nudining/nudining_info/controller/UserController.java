package com.nudining.nudining_info.controller;

import com.nudining.nudining_info.entities.User;
import com.nudining.nudining_info.service.UserService;
import com.nudining.nudining_info.entities.UserLoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    //User Methods:

    //Create Users
    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/addUser")
    public User addUser(@RequestBody User user) {
        return userService.saveUser(user);
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
    public ResponseEntity<String> login(@RequestBody UserLoginRequest loginRequest) {
        Optional<User> user = userService.findUserByEmail(loginRequest.getEmail());
        
        if (user.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
            // Return success response
            return ResponseEntity.ok("Login successful");
        } else {
            // Return failure response
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email or password mismatch");
        }
    }

} 