package com.example.demo.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GooglePlacesService {

    @Value("${google.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.create("https://maps.googleapis.com/maps/api/place");

    public Map<String, Object> getPlacesByCityAndType(String city, String type) {
        String query = type + " in " + city;

        List<Object> allResults = new ArrayList<>();
        String url = "/textsearch/json";
        String nextPageToken = null;
        int maxPages = 3; // 3 pages max (60 lieux)
        int currentPage = 0;

        do {
            if (nextPageToken != null) {
                // Obligatoire : attendre que le token soit actif
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }

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

        // Retourner les résultats fusionnés
        Map<String, Object> finalResponse = new HashMap<>();
        finalResponse.put("results", allResults);
        return finalResponse;
    }

}
