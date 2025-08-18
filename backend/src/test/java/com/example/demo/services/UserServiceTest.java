package com.example.demo.services;

import com.example.demo.dto.UpdateUserRequest;
import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

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
    void save_ShouldEncodePasswordAndSaveUser() {
        // Given
        User userToSave = User.builder()
                .nom("New User")
                .email("new@example.com")
                .motDePasse("plainPassword")
                .build();

        when(passwordEncoder.encode("plainPassword")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(userToSave);

        // When
        User savedUser = userService.save(userToSave);

        // Then
        verify(passwordEncoder).encode("plainPassword");
        verify(userRepository).save(userToSave);
        assertEquals("encodedPassword", userToSave.getMotDePasse());
        assertNotNull(savedUser);
    }

    @Test
    void findByEmail_ShouldReturnUser_WhenUserExists() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.findByEmail("test@example.com");

        // Then
        assertTrue(result.isPresent());
        assertEquals(testUser.getEmail(), result.get().getEmail());
        verify(userRepository).findByEmail("test@example.com");
    }

    @Test
    void findByEmail_ShouldReturnEmpty_WhenUserDoesNotExist() {
        // Given
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.findByEmail("nonexistent@example.com");

        // Then
        assertTrue(result.isEmpty());
        verify(userRepository).findByEmail("nonexistent@example.com");
    }

    @Test
    void emailExists_ShouldReturnTrue_WhenEmailExists() {
        // Given
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // When
        boolean exists = userService.emailExists("test@example.com");

        // Then
        assertTrue(exists);
        verify(userRepository).existsByEmail("test@example.com");
    }

    @Test
    void emailExists_ShouldReturnFalse_WhenEmailDoesNotExist() {
        // Given
        when(userRepository.existsByEmail("nonexistent@example.com")).thenReturn(false);

        // When
        boolean exists = userService.emailExists("nonexistent@example.com");

        // Then
        assertFalse(exists);
        verify(userRepository).existsByEmail("nonexistent@example.com");
    }

    @Test
    void deleteUser_ShouldDeleteUser_WhenUserExists() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // When
        userService.deleteUser("test@example.com");

        // Then
        verify(userRepository).findByEmail("test@example.com");
        verify(userRepository).delete(testUser);
    }

    @Test
    void deleteUser_ShouldThrowException_WhenUserDoesNotExist() {
        // Given
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.deleteUser("nonexistent@example.com"));

        assertEquals("L'utilisateur n'existe pas", exception.getMessage());
        verify(userRepository).findByEmail("nonexistent@example.com");
        verify(userRepository, never()).delete(any(User.class));
    }

    @Test
    void findAllUsers_ShouldReturnAllUsers() {
        // Given
        List<User> users = Arrays.asList(testUser,
                User.builder().id(2L).nom("User 2").email("user2@example.com").build());
        when(userRepository.findAll()).thenReturn(users);

        // When
        List<User> result = userService.findAllUsers();

        // Then
        assertEquals(2, result.size());
        verify(userRepository).findAll();
    }

    @Test
    void updateUserInfo_ShouldUpdateUser_WhenUserExists() {
        // Given
        UpdateUserRequest updateData = new UpdateUserRequest();
        updateData.setNom("Updated Name");
        updateData.setEmail("updated@example.com");
        updateData.setVille("Lyon");
        updateData.setMotDePasse("newPassword");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail("updated@example.com")).thenReturn(false);
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User updatedUser = userService.updateUserInfo(1L, updateData);

        // Then
        verify(userRepository).findById(1L);
        verify(userRepository).existsByEmail("updated@example.com");
        verify(passwordEncoder).encode("newPassword");
        verify(userRepository).save(testUser);

        assertEquals("Updated Name", testUser.getNom());
        assertEquals("updated@example.com", testUser.getEmail());
        assertEquals("Lyon", testUser.getVille());
        assertEquals("encodedNewPassword", testUser.getMotDePasse());
    }

    @Test
    void updateUserInfo_ShouldThrowException_WhenUserNotFound() {
        // Given
        UpdateUserRequest updateData = new UpdateUserRequest();
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.updateUserInfo(999L, updateData));

        assertEquals("Utilisateur non trouvé", exception.getMessage());
        verify(userRepository).findById(999L);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUserInfo_ShouldThrowException_WhenEmailAlreadyExists() {
        // Given
        UpdateUserRequest updateData = new UpdateUserRequest();
        updateData.setEmail("existing@example.com");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.updateUserInfo(1L, updateData));

        assertEquals("Email déjà utilisé.", exception.getMessage());
        verify(userRepository).findById(1L);
        verify(userRepository).existsByEmail("existing@example.com");
        verify(userRepository, never()).save(any(User.class));
    }
}