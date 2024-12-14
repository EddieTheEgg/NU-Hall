package com.nudining.nudining_info.service;

import com.nudining.nudining_info.entities.User;
import com.nudining.nudining_info.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional; //This is like a container object, so we can return empty or not, and also retrieve temp values/objects within
import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;

    //UserService Controller(s)
    @Autowired
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    //UserService Methods

    //Save/Update User
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    //Find user by ID
    public Optional<User> findUserByID (Long id){
        return userRepository.findById(id);
    }

    //Delete user by ID
    public void deleteUser(Long id){
        userRepository.deleteById(id);
    }


    //Find user by email
    public Optional<User> findUserByEmail(String email){
        return userRepository.findByEmail(email);
    }

    //Update dietary restriction
    public User updateDietaryRestrictions(Long id, Map<String, Object> newDietaryRestrictions) {
        Optional<User> targetUser = userRepository.findById(id);
        if (targetUser.isPresent()){
            User user = targetUser.get(); //Gets the User contained in Optional object
            user.setDietaryRestrictions(newDietaryRestrictions);
            return userRepository.save(user);
        }
        return null;
    }

     //Update Nutritional Focus
     public User updateNutritionalFocus(Long id, Map<String, Object> newNutritionalFocus) {
        Optional<User> targetUser = userRepository.findById(id);
        if (targetUser.isPresent()) {
            User user = targetUser.get(); 
            user.setNutritionalFocus(newNutritionalFocus); 
            return userRepository.save(user); 
        }
        return null;
    }
    
}
