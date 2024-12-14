package com.nudining.nudining_info.service;

import com.nudining.nudining_info.entities.User;
import com.nudining.nudining_info.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User saveUser(User user) {
        // Save the user to the database
        return userRepository.save(user);
    }
}
