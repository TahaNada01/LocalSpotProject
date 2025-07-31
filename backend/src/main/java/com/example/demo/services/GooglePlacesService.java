package com.example.demo.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class GooglePlacesService {

    @Value("${google.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.create("https://maps.googleapis.com/maps/api/place");

    public Map<String, Object> getPlacesByCityAndType(String city, String type) {
        String query = type + " in " + city;

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/textsearch/json")
                        .queryParam("query", query)
                        .queryParam("key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }
}
