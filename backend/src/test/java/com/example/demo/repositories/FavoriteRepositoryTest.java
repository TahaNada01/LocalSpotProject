package com.example.demo.repositories;

import com.example.demo.entities.Favorite;
import com.example.demo.entities.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class FavoriteRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private FavoriteRepository favoriteRepository;

    private User testUser;
    private Favorite testFavorite;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .nom("Test User")
                .email("test@example.com")
                .motDePasse("password")
                .role("USER")
                .build();
        testUser = entityManager.persistAndFlush(testUser);

        testFavorite = Favorite.builder()
                .name("Test Place")
                .address("123 Test Street")
                .placeId("place123")
                .photoReference("photo123")
                .rating(4.5)
                .openNow(true)
                .user(testUser)
                .build();
    }

    @Test
    void findByUser_ShouldReturnUserFavorites() {
        entityManager.persistAndFlush(testFavorite);

        List<Favorite> favorites = favoriteRepository.findByUser(testUser);

        assertEquals(1, favorites.size());
        assertEquals("Test Place", favorites.get(0).getName());
        assertEquals("place123", favorites.get(0).getPlaceId());
    }

    @Test
    void findByUser_ShouldReturnEmpty_WhenNoFavorites() {
        List<Favorite> favorites = favoriteRepository.findByUser(testUser);
        assertTrue(favorites.isEmpty());
    }

    @Test
    void existsByUserAndPlaceId_ShouldReturnTrue_WhenExists() {
        entityManager.persistAndFlush(testFavorite);

        boolean exists = favoriteRepository.existsByUserAndPlaceId(testUser, "place123");
        assertTrue(exists);
    }

    @Test
    void existsByUserAndPlaceId_ShouldReturnFalse_WhenNotExists() {
        boolean exists = favoriteRepository.existsByUserAndPlaceId(testUser, "nonexistent");
        assertFalse(exists);
    }

    @Test
    void deleteByUserAndPlaceId_ShouldRemoveFavorite() {
        entityManager.persistAndFlush(testFavorite);

        favoriteRepository.deleteByUserAndPlaceId(testUser, "place123");
        entityManager.flush();

        boolean exists = favoriteRepository.existsByUserAndPlaceId(testUser, "place123");
        assertFalse(exists);
    }

    @Test
    void save_ShouldPersistFavorite() {
        Favorite saved = favoriteRepository.save(testFavorite);

        assertNotNull(saved.getId());
        assertEquals("Test Place", saved.getName());
        assertEquals(testUser.getId(), saved.getUser().getId());
    }

    @Test
    void findByUser_ShouldReturnMultipleFavorites() {
        Favorite favorite2 = Favorite.builder()
                .name("Second Place")
                .address("456 Second Street")
                .placeId("place456")
                .user(testUser)
                .build();

        entityManager.persistAndFlush(testFavorite);
        entityManager.persistAndFlush(favorite2);

        List<Favorite> favorites = favoriteRepository.findByUser(testUser);

        assertEquals(2, favorites.size());
    }
}
