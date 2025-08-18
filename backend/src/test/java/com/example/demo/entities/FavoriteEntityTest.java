package com.example.demo.entities;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class FavoriteEntityTest {

    private Favorite favorite;
    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .nom("Test User")
                .email("test@example.com")
                .build();

        favorite = Favorite.builder()
                .id(1L)
                .name("Test Place")
                .address("123 Test Street")
                .placeId("place123")
                .photoReference("photo123")
                .rating(4.5)
                .openNow(true)
                .user(user)
                .build();
    }

    @Test
    void builder_ShouldCreateValidFavorite() {
        assertNotNull(favorite);
        assertEquals("Test Place", favorite.getName());
        assertEquals("123 Test Street", favorite.getAddress());
        assertEquals("place123", favorite.getPlaceId());
        assertEquals("photo123", favorite.getPhotoReference());
        assertEquals(4.5, favorite.getRating());
        assertTrue(favorite.getOpenNow());
        assertEquals(user, favorite.getUser());
    }

    @Test
    void settersAndGetters_ShouldWork() {
        favorite.setName("New Place");
        favorite.setAddress("456 New Street");
        favorite.setRating(3.5);
        favorite.setOpenNow(false);

        assertEquals("New Place", favorite.getName());
        assertEquals("456 New Street", favorite.getAddress());
        assertEquals(3.5, favorite.getRating());
        assertFalse(favorite.getOpenNow());
    }

    @Test
    void noArgsConstructor_ShouldWork() {
        Favorite emptyFavorite = new Favorite();
        assertNotNull(emptyFavorite);
        assertNull(emptyFavorite.getName());
    }
}