package com.example.demo.security;

import com.example.demo.entities.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        userDetails = User.builder()
                .email("test@example.com")
                .motDePasse("password")
                .role("USER")
                .build();
    }

    @Test
    void generateToken_ShouldCreateValidToken() {
        String token = jwtUtil.generateToken("test@example.com", "USER");

        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.contains("."));
        // JWT should have 3 parts separated by dots
        assertEquals(3, token.split("\\.").length);
    }

    @Test
    void generateRefreshToken_ShouldCreateValidToken() {
        String refreshToken = jwtUtil.generateRefreshToken("test@example.com");

        assertNotNull(refreshToken);
        assertFalse(refreshToken.isEmpty());
        assertTrue(refreshToken.contains("."));
        assertEquals(3, refreshToken.split("\\.").length);
    }

    @Test
    void extractEmail_ShouldReturnCorrectEmail() {
        String token = jwtUtil.generateToken("test@example.com", "USER");
        String extractedEmail = jwtUtil.extractEmail(token);

        assertEquals("test@example.com", extractedEmail);
    }

    @Test
    void extractRole_ShouldReturnCorrectRole() {
        String token = jwtUtil.generateToken("test@example.com", "USER");
        String extractedRole = jwtUtil.extractRole(token);

        assertEquals("USER", extractedRole);
    }

    @Test
    void extractRole_ShouldReturnAdminRole() {
        String token = jwtUtil.generateToken("admin@example.com", "ADMIN");
        String extractedRole = jwtUtil.extractRole(token);

        assertEquals("ADMIN", extractedRole);
    }

    @Test
    void isTokenValid_ShouldReturnTrue_ForValidToken() {
        String token = jwtUtil.generateToken("test@example.com", "USER");
        boolean isValid = jwtUtil.isTokenValid(token, userDetails);

        assertTrue(isValid);
    }

    @Test
    void isTokenValid_ShouldReturnFalse_ForWrongUser() {
        String token = jwtUtil.generateToken("other@example.com", "USER");
        boolean isValid = jwtUtil.isTokenValid(token, userDetails);

        assertFalse(isValid);
    }

    @Test
    void isTokenValid_ShouldReturnFalse_ForInvalidToken() {
        String invalidToken = "invalid.token.here";

        assertThrows(Exception.class, () -> {
            jwtUtil.isTokenValid(invalidToken, userDetails);
        });
    }

    @Test
    void refreshToken_ShouldHaveDifferentStructure() {
        String accessToken = jwtUtil.generateToken("test@example.com", "USER");
        String refreshToken = jwtUtil.generateRefreshToken("test@example.com");

        String emailFromAccess = jwtUtil.extractEmail(accessToken);
        String emailFromRefresh = jwtUtil.extractEmail(refreshToken);

        assertEquals("test@example.com", emailFromAccess);
        assertEquals("test@example.com", emailFromRefresh);
        assertNotEquals(accessToken, refreshToken);
    }

    @Test
    void extractEmail_ShouldThrowException_ForInvalidToken() {
        String invalidToken = "invalid.token";

        assertThrows(Exception.class, () -> {
            jwtUtil.extractEmail(invalidToken);
        });
    }

    @Test
    void extractRole_ShouldThrowException_ForInvalidToken() {
        String invalidToken = "invalid.token";

        assertThrows(Exception.class, () -> {
            jwtUtil.extractRole(invalidToken);
        });
    }

    @Test
    void generateToken_ShouldCreateDifferentTokens_ForDifferentUsers() {
        String token1 = jwtUtil.generateToken("user1@example.com", "USER");
        String token2 = jwtUtil.generateToken("user2@example.com", "USER");

        assertNotEquals(token1, token2);
    }

    @Test
    void generateToken_ShouldCreateDifferentTokens_ForDifferentRoles() {
        String userToken = jwtUtil.generateToken("test@example.com", "USER");
        String adminToken = jwtUtil.generateToken("test@example.com", "ADMIN");

        assertNotEquals(userToken, adminToken);
        assertEquals("USER", jwtUtil.extractRole(userToken));
        assertEquals("ADMIN", jwtUtil.extractRole(adminToken));
    }
}