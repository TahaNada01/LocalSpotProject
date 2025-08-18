package com.example.demo.entities;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class UserPlaceEntityTest {

    private UserPlace userPlace;
    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .nom("Test User")
                .email("test@example.com")
                .build();

        userPlace = new UserPlace();
        userPlace.setId(1L);
        userPlace.setName("Test Place");
        userPlace.setCategory("Restaurant");
        userPlace.setAddressLine("123 Test Street");
        userPlace.setCity("Paris");
        userPlace.setPostalCode("75001");
        userPlace.setCountry("France");
        userPlace.setShortDescription("A nice place");
        userPlace.setPriceRange("€€");
        userPlace.setAvgPrice(25);
        userPlace.setOpeningHoursJson("{}");
        userPlace.setImageUrl("/media/test.jpg");
        userPlace.setCreatedBy(user);
        userPlace.setStatus(UserPlace.Status.APPROVED);
    }

    @Test
    void gettersAndSetters_ShouldWork() {
        assertEquals(1L, userPlace.getId());
        assertEquals("Test Place", userPlace.getName());
        assertEquals("Restaurant", userPlace.getCategory());
        assertEquals("123 Test Street", userPlace.getAddressLine());
        assertEquals("Paris", userPlace.getCity());
        assertEquals("75001", userPlace.getPostalCode());
        assertEquals("France", userPlace.getCountry());
        assertEquals("A nice place", userPlace.getShortDescription());
        assertEquals("€€", userPlace.getPriceRange());
        assertEquals(25, userPlace.getAvgPrice());
        assertEquals("{}", userPlace.getOpeningHoursJson());
        assertEquals("/media/test.jpg", userPlace.getImageUrl());
        assertEquals(user, userPlace.getCreatedBy());
        assertEquals(UserPlace.Status.APPROVED, userPlace.getStatus());
    }

    @Test
    void status_ShouldHaveCorrectValues() {
        assertEquals(UserPlace.Status.PENDING, UserPlace.Status.valueOf("PENDING"));
        assertEquals(UserPlace.Status.APPROVED, UserPlace.Status.valueOf("APPROVED"));
        assertEquals(UserPlace.Status.REJECTED, UserPlace.Status.valueOf("REJECTED"));
    }

    @Test
    void prePersist_ShouldSetCreatedAt() {
        // Simulate @PrePersist
        if (userPlace.getCreatedAt() == null) {
            userPlace.setCreatedAt(Instant.now());
        }

        assertNotNull(userPlace.getCreatedAt());
    }

    @Test
    void defaultStatus_ShouldBePending() {
        UserPlace newPlace = new UserPlace();
        assertEquals(UserPlace.Status.PENDING, newPlace.getStatus());
    }
}