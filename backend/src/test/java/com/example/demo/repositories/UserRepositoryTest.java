package com.example.demo.repositories;

import com.example.demo.entities.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .nom("Test User")
                .email("test@example.com")
                .motDePasse("password")
                .ville("Paris")
                .role("USER")
                .build();
    }

    @Test
    void findByEmail_ShouldReturnUser_WhenEmailExists() {
        // Given
        entityManager.persistAndFlush(testUser);

        // When
        Optional<User> found = userRepository.findByEmail("test@example.com");

        // Then
        assertTrue(found.isPresent());
        assertEquals("test@example.com", found.get().getEmail());
        assertEquals("Test User", found.get().getNom());
    }

    @Test
    void findByEmail_ShouldReturnEmpty_WhenEmailDoesNotExist() {
        // When
        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");

        // Then
        assertTrue(found.isEmpty());
    }

    @Test
    void existsByEmail_ShouldReturnTrue_WhenEmailExists() {
        // Given
        entityManager.persistAndFlush(testUser);

        // When
        boolean exists = userRepository.existsByEmail("test@example.com");

        // Then
        assertTrue(exists);
    }

    @Test
    void existsByEmail_ShouldReturnFalse_WhenEmailDoesNotExist() {
        // When
        boolean exists = userRepository.existsByEmail("nonexistent@example.com");

        // Then
        assertFalse(exists);
    }

    @Test
    void save_ShouldPersistUser() {
        // When
        User saved = userRepository.save(testUser);

        // Then
        assertNotNull(saved.getId());
        assertEquals("test@example.com", saved.getEmail());

        // Verify it was actually persisted
        User found = entityManager.find(User.class, saved.getId());
        assertNotNull(found);
        assertEquals("test@example.com", found.getEmail());
    }

    @Test
    void delete_ShouldRemoveUser() {
        // Given
        User saved = entityManager.persistAndFlush(testUser);
        Long userId = saved.getId();

        // When
        userRepository.delete(saved);
        entityManager.flush();

        // Then
        User found = entityManager.find(User.class, userId);
        assertNull(found);
    }

    @Test
    void findByEmail_ShouldBeCaseExact() {
        // Given
        entityManager.persistAndFlush(testUser);

        // When
        Optional<User> foundLower = userRepository.findByEmail("test@example.com");
        Optional<User> foundUpper = userRepository.findByEmail("TEST@EXAMPLE.COM");

        // Then
        assertTrue(foundLower.isPresent());
        assertTrue(foundUpper.isEmpty()); // Email should be case-sensitive
    }
}