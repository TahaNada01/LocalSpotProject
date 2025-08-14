package com.example.demo.dto;

public record PlaceCardResponse(
        Long id,
        String name,
        String category,
        String city,
        String imageUrl,
        String priceRange,
        Integer avgPrice
) {}
