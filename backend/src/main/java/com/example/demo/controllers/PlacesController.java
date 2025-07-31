package com.example.demo.controllers;

import com.example.demo.services.GooglePlacesService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/places")
public class PlacesController {

    private final GooglePlacesService googlePlacesService;

    public PlacesController(GooglePlacesService googlePlacesService) {
        this.googlePlacesService = googlePlacesService;
    }

    @GetMapping
    public Map<String, Object> getPlaces(@RequestParam String ville, @RequestParam String type) {
        return googlePlacesService.getPlacesByCityAndType(ville, type);
    }

}
