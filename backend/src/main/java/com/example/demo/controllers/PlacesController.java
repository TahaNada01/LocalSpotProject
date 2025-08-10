package com.example.demo.controllers;

import com.example.demo.services.GooglePlacesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/places")
public class PlacesController {

    private final GooglePlacesService googlePlacesService;

    public PlacesController(GooglePlacesService googlePlacesService) {
        this.googlePlacesService = googlePlacesService;
    }

    // EXISTANT: textsearch
    @GetMapping
    public Map<String, Object> getPlaces(@RequestParam String ville, @RequestParam String type) {
        return googlePlacesService.getPlacesByCityAndType(ville, type);
    }

    // NOUVEAU: place details
    @GetMapping("/details")
    public Map<String, Object> getPlaceDetails(
            @RequestParam("placeId") String placeId,
            @RequestParam(value = "fields", required = false) String fields) {
        return googlePlacesService.getPlaceDetails(placeId, fields);
    }

    // NOUVEAU: photo proxy
    @GetMapping("/photo")
    public ResponseEntity<byte[]> getPhoto(
            @RequestParam("photoreference") String photoReference,
            @RequestParam(value = "maxwidth", defaultValue = "900") int maxWidth) {
        return googlePlacesService.getPhoto(photoReference, maxWidth);
    }
}
