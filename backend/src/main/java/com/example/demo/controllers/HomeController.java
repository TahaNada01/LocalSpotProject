package com.example.demo.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
                "application", "LocalSpot Backend",
                "status", "running",
                "version", "1.0.0",
                "endpoints", Map.of(
                        "health", "/actuator/health",
                        "auth", "/auth/*",
                        "places", "/api/places/*",
                        "favorites", "/favorites/*"
                )
        );
    }
}