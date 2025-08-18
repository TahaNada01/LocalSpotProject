package com.example.demo.entities;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

class UserEntityTest {

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .nom("Test User")
                .email("test@example.com")
                .motDePasse("password")
                .ville("Paris")
                .role("USER")
                .build();
    }

    @Test
    void getAuthorities_ShouldReturnCorrectRole() {
        // When
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();

        // Then
        assertEquals(1, authorities.size());
        assertTrue(authorities.stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_USER")));
    }

    @Test
    void getPassword_ShouldReturnMotDePasse() {
        // When
        String password = user.getPassword();

        // Then
        assertEquals("password", password);
    }

    @Test
    void getUsername_ShouldReturnEmail() {
        // When
        String username = user.getUsername();

        // Then
        assertEquals("test@example.com", username);
    }

    @Test
    void accountNonExpired_ShouldReturnTrue() {
        // When & Then
        assertTrue(user.isAccountNonExpired());
    }

    @Test
    void accountNonLocked_ShouldReturnTrue() {
        // When & Then
        assertTrue(user.isAccountNonLocked());
    }

    @Test
    void credentialsNonExpired_ShouldReturnTrue() {
        // When & Then
        assertTrue(user.isCredentialsNonExpired());
    }

    @Test
    void enabled_ShouldReturnTrue() {
        // When & Then
        assertTrue(user.isEnabled());
    }

    @Test
    void builder_ShouldCreateValidUser() {
        // Given & When
        User builtUser = User.builder()
                .nom("Built User")
                .email("built@example.com")
                .motDePasse("builtPassword")
                .role("ADMIN")
                .build();

        // Then
        assertEquals("Built User", builtUser.getNom());
        assertEquals("built@example.com", builtUser.getEmail());
        assertEquals("builtPassword", builtUser.getMotDePasse());
        assertEquals("ADMIN", builtUser.getRole());
    }

    @Test
    void equals_ShouldWork() {
        // Given
        User user1 = User.builder().id(1L).email("test@example.com").build();
        User user2 = User.builder().id(1L).email("test@example.com").build();
        User user3 = User.builder().id(2L).email("other@example.com").build();

        // When & Then
        assertEquals(user1, user2);
        assertNotEquals(user1, user3);
        assertNotEquals(user1, null);
        assertNotEquals(user1, "not a user");
    }
}