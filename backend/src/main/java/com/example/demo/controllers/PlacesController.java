package com.example.demo.controllers;

import com.example.demo.dto.UserPlaceResponse;
import com.example.demo.services.GooglePlacesService;
import com.example.demo.services.UserPlaceService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/places")
public class PlacesController {

    private final GooglePlacesService googlePlacesService;
    private final UserPlaceService userPlaceService;

    public PlacesController(GooglePlacesService googlePlacesService,
                            UserPlaceService userPlaceService) {
        this.googlePlacesService = googlePlacesService;
        this.userPlaceService = userPlaceService;
    }

    // =========================
    // LEGACY ALIAS (Home existant)
    // =========================
    // Ex: GET /api/places?ville=Paris&type=cafe
    @GetMapping(params = {"ville","type"})
    public Map<String, Object> legacySearch(
            @RequestParam String ville,
            @RequestParam String type
    ) {
        return googlePlacesService.getPlacesByCityAndType(ville, type);
    }

    // Ex: GET /api/places/details?placeId=...&fields=...
    @GetMapping("/details")
    public Map<String, Object> legacyDetails(
            @RequestParam("placeId") String placeId,
            @RequestParam(value = "fields", required = false) String fields
    ) {
        return googlePlacesService.getPlaceDetails(placeId, fields);
    }

    // Ex: GET /api/places/photo?photoreference=...&maxwidth=400
    @GetMapping("/photo")
    public ResponseEntity<byte[]> legacyPhoto(
            @RequestParam("photoreference") String photoReference,
            @RequestParam(value = "maxwidth", defaultValue = "900") int maxWidth
    ) {
        return googlePlacesService.getPhoto(photoReference, maxWidth);
    }

    // =========================
    // GOOGLE PLACES (nouvelles routes)
    // =========================
    @GetMapping("/google/search")
    public Map<String, Object> searchGoogle(
            @RequestParam String ville,
            @RequestParam String type
    ) {
        return googlePlacesService.getPlacesByCityAndType(ville, type);
    }

    @GetMapping("/google/details")
    public Map<String, Object> getGooglePlaceDetails(
            @RequestParam("placeId") String placeId,
            @RequestParam(value = "fields", required = false) String fields
    ) {
        return googlePlacesService.getPlaceDetails(placeId, fields);
    }

    @GetMapping("/google/photo")
    public ResponseEntity<byte[]> getGooglePhoto(
            @RequestParam("photoreference") String photoReference,
            @RequestParam(value = "maxwidth", defaultValue = "900") int maxWidth
    ) {
        return googlePlacesService.getPhoto(photoReference, maxWidth);
    }

    // =========================
    // COMMUNITY (public)
    // =========================
    @GetMapping("/public")
    public ResponseEntity<Page<UserPlaceResponse>> listPublic(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category
    ) {
        return ResponseEntity.ok(userPlaceService.listPublic(page, size, city, category));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<UserPlaceResponse> getPublic(@PathVariable Long id) {
        return ResponseEntity.ok(userPlaceService.getPublic(id));
    }
}
