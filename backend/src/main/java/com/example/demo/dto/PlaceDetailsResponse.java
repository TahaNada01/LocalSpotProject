package com.example.demo.dto;

public record PlaceDetailsResponse(
        Long id,
        String name,
        String category,
        String addressLine,
        String city,
        String postalCode,
        String country,
        String shortDescription,
        String priceRange,
        Integer avgPrice,
        String imageUrl,
        String openingHoursJson,
        Long createdById
) {}
