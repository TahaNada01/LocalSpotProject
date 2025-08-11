package com.example.demo.dto;

public record UserPlaceResponse(
        Long id, String name, String imageUrl, Long createdById, String openingHoursJson
) {}
