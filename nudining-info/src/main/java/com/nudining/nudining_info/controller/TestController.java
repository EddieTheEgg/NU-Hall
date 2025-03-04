package com.nudining.nudining_info.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.jdbc.core.JdbcTemplate;

@RestController
public class TestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/test-connection")
    public String testConnection() {
        try {
            jdbcTemplate.execute("SELECT 1");
            return "Connection to AWS RDS is successful!";
        } catch (Exception e) {
            return "Connection to AWS RDS failed: " + e.getMessage();
        }
    }
}
