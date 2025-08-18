package com.example.demo.controllers;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.UpdateUserRequest;
import com.example.demo.entities.User;
import com.example.demo.security.JwtUtil;
import com.example.demo.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserController userController;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .nom("Test User")
                .email("test@example.com")
                .motDePasse("encodedPassword")
                .ville("Paris")
                .role("USER")
                .build();
    }

    @Test
    void register_ShouldReturnUser_WhenEmailNotExists() {
        // Given
        when(userService.emailExists("test@example.com")).thenReturn(false);
        when(userService.save(any(User.class))).thenReturn(testUser);

        // When
        ResponseEntity<?> response = userController.registerUser(testUser);

        // Then
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(testUser, response.getBody());
    }

    @Test
    void register_ShouldReturnBadRequest_WhenEmailExists() {
        // Given
        when(userService.emailExists("test@example.com")).thenReturn(true);

        // When
        ResponseEntity<?> response = userController.registerUser(testUser);

        // Then
        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Email déjà utilisé.", response.getBody());
    }

    @Test
    void login_ShouldReturnToken_WhenValidCredentials() {
        // Given
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setMotDePasse("password");

        when(userService.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(jwtUtil.generateToken("test@example.com", "USER")).thenReturn("access-token");
        when(jwtUtil.generateRefreshToken("test@example.com")).thenReturn("refresh-token");

        // When
        ResponseEntity<?> response = userController.login(loginRequest);

        // Then
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
    }

    @Test
    void login_ShouldReturnUnauthorized_WhenUserNotFound() {
        // Given
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nonexistent@example.com");
        loginRequest.setMotDePasse("password");

        when(userService.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // When
        ResponseEntity<?> response = userController.login(loginRequest);

        // Then
        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Email incorrect", response.getBody());
    }

    @Test
    void login_ShouldReturnUnauthorized_WhenWrongPassword() {
        // Given
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setMotDePasse("wrongPassword");

        when(userService.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        // When
        ResponseEntity<?> response = userController.login(loginRequest);

        // Then
        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Mot de passe ou Email incorrect", response.getBody());
    }

    @Test
    void getUserInfo_ShouldReturnUserDTO() {
        // When
        ResponseEntity<?> response = userController.getUserInfo(testUser);

        // Then
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
    }

    @Test
    void deleteUser_ShouldReturnOk() {
        // When
        ResponseEntity<?> response = userController.deleteUser(testUser);

        // Then
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Utilisateur supprimé.", response.getBody());
    }

    @Test
    void updateUser_ShouldReturnNewTokens() {
        // Given
        UpdateUserRequest updateRequest = new UpdateUserRequest();
        updateRequest.setNom("Updated Name");

        when(userService.updateUserInfo(any(Long.class), any(UpdateUserRequest.class)))
                .thenReturn(testUser);
        when(jwtUtil.generateToken(anyString(), anyString())).thenReturn("new-access-token");
        when(jwtUtil.generateRefreshToken(anyString())).thenReturn("new-refresh-token");

        // When
        ResponseEntity<?> response = userController.updateUser(testUser, updateRequest);

        // Then
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
    }

    @Test
    void refreshToken_ShouldReturnNewToken_WhenValidRefreshToken() {
        // Given
        String refreshToken = "valid-refresh-token";
        when(jwtUtil.extractEmail(refreshToken)).thenReturn("test@example.com");
        when(userService.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(jwtUtil.isTokenValid(refreshToken, testUser)).thenReturn(true);
        when(jwtUtil.generateToken("test@example.com", "USER")).thenReturn("new-access-token");

        // When
        ResponseEntity<?> response = userController.refreshToken(java.util.Map.of("refreshToken", refreshToken));

        // Then
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
    }
}