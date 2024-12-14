package com.nudining.nudining_info.repository;

import com.nudining.nudining_info.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // You can define custom query methods here if needed

    // Example: Find a user by name
    User findByName(String name);
}