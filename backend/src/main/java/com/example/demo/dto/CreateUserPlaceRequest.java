package com.example.demo.dto;

import jakarta.validation.constraints.*;

public record CreateUserPlaceRequest(
        @NotBlank @Size(min=2,max=120) String name,
        @NotBlank String category,
        @NotBlank String addressLine,
        @NotBlank String city,
        @NotBlank @Size(min=3,max=10) String postalCode,
        @NotBlank String country,
        @NotBlank @Size(max=200) String shortDescription,
        @Pattern(regexp="^$|€{1,3}$") String priceRange,   // "", "€", "€€", "€€€"
        @PositiveOrZero Integer avgPrice,
        @Size(max=4000) String openingHoursJson
) {}
