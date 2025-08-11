package com.example.demo.dto;

public record UserPlaceResponse(
        Long id, String name,
        String imageUrl,
        Long createdById,
        String openingHoursJson,
        String addressLine,
        String city,
        String postalCode,
        String country,
        String category,
        String shortDescription,
        Integer avgPrice,
        String priceRange
) {}
