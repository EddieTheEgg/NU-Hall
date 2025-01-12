package com.nudining.nudining_info;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class NuDiningApplication {

	public static void main(String[] args) {
		SpringApplication.run(NuDiningApplication.class, args);
	}

}