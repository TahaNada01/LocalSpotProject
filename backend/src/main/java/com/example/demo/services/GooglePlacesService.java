// src/main/java/com/example/demo/services/GooglePlacesService.java
package com.example.demo.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;
import java.util.*;

@Service
public class GooglePlacesService {

    @Value("${google.api.key}")
    private String apiKey;

    // WebClient pour /textsearch et /details
    private final WebClient webClient = WebClient.create("https://maps.googleapis.com/maps/api/place");

    // RestTemplate pour /photo (gère 302)
    private final RestTemplate restTemplate = new RestTemplate();


    public Map<String, Object> getPlacesByCityAndType(String city, String type) {
        String query = type + " in " + city;

        List<Object> allResults = new ArrayList<>();
        String url;
        String nextPageToken = null;
        int maxPages = 3;
        int currentPage = 0;

        do {
            if (nextPageToken != null) {
                try { Thread.sleep(2000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
                url = "/textsearch/json?pagetoken=" + nextPageToken;
            } else {
                url = "/textsearch/json?query=" + query.replace(" ", "+");
            }

            Map<String, Object> response = webClient.get()
                    .uri(url + "&key=" + apiKey)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();

            if (response == null || !response.containsKey("results")) break;

            List<Object> results = (List<Object>) response.get("results");
            allResults.addAll(results);

            nextPageToken = (String) response.get("next_page_token");
            currentPage++;

        } while (nextPageToken != null && currentPage < maxPages);

        Map<String, Object> finalResponse = new HashMap<>();
        finalResponse.put("results", allResults);
        return finalResponse;
    }


    public Map<String, Object> getPlaceDetails(String placeId, String fields) {
        String defaultFields =
                "place_id,name,formatted_address,geometry,opening_hours,website," +
                        "international_phone_number,rating,user_ratings_total,price_level,types,photos,reviews";
        String f = (fields == null || fields.isBlank()) ? defaultFields : fields;

        String url = "/details/json?place_id=" + placeId + "&fields=" + f + "&key=" + apiKey;

        Map<String, Object> response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        // l’API renvoie sous { result: {...}, status: "OK" }
        if (response == null) return Map.of();
        return response;
    }

    //Photo Proxy ===
    public ResponseEntity<byte[]> getPhoto(String photoReference, int maxWidth) {
        // 1er appel (Google renvoie souvent 302 vers l’URL finale)
        String url = "https://maps.googleapis.com/maps/api/place/photo" +
                "?photoreference=" + photoReference +
                "&maxwidth=" + maxWidth +
                "&key=" + apiKey;

        ResponseEntity<byte[]> resp = restTemplate.getForEntity(URI.create(url), byte[].class);

        // Si 200 direct → on renvoie l’image telle quelle
        if (resp.getStatusCode().is2xxSuccessful()) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(resp.getHeaders().getContentType() != null
                    ? resp.getHeaders().getContentType()
                    : MediaType.IMAGE_JPEG);
            headers.setCacheControl(CacheControl.maxAge(java.time.Duration.ofHours(12)));
            return new ResponseEntity<>(resp.getBody(), headers, HttpStatus.OK);
        }

        // Si redirection
        if (resp.getStatusCode().is3xxRedirection() && resp.getHeaders().getLocation() != null) {
            ResponseEntity<byte[]> redirected = restTemplate.getForEntity(resp.getHeaders().getLocation(), byte[].class);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(redirected.getHeaders().getContentType() != null
                    ? redirected.getHeaders().getContentType()
                    : MediaType.IMAGE_JPEG);
            headers.setCacheControl(CacheControl.maxAge(java.time.Duration.ofHours(12)));
            return new ResponseEntity<>(redirected.getBody(), headers, HttpStatus.OK);
        }

        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
    }
}
