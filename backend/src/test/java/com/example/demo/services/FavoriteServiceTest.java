package com.example.demo.services;

import com.example.demo.dto.FavoriteDto;
import com.example.demo.dto.FavoriteResponseDto;
import com.example.demo.entities.Favorite;
import com.example.demo.entities.User;
import com.example.demo.repositories.FavoriteRepository;
import com.example.demo.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private FavoriteService favoriteService;

    private User testUser;
    private Favorite testFavorite;
    private FavoriteDto testFavoriteDto;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .nom("Test User")
                .build();

        testFavorite = Favorite.builder()
                .id(1L)
                .name("Test Place")
                .address("123 Test Street")
                .placeId("place123")
                .photoReference("photo123")
                .rating(4.5)
                .openNow(true)
                .user(testUser)
                .build();

        testFavoriteDto = new FavoriteDto();
        testFavoriteDto.setName("Test Place");
        testFavoriteDto.setAddress("123 Test Street");
        testFavoriteDto.setPlaceId("place123");
        testFavoriteDto.setPhotoReference("photo123");
        testFavoriteDto.setRating(4.5);
        testFavoriteDto.setOpenNow(true);
    }

    @Test
    void getFavoritesByEmail_ShouldReturnFavoritesList_WhenUserExists() {
        // Given
        List<Favorite> favorites = Arrays.asList(testFavorite);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(favoriteRepository.findByUser(testUser)).thenReturn(favorites);

        // When
        List<FavoriteResponseDto> result = favoriteService.getFavoritesByEmail("test@example.com");

        // Then
        assertEquals(1, result.size());
        FavoriteResponseDto responseDto = result.get(0);
        assertEquals("Test Place", responseDto.getName());
        assertEquals("123 Test Street", responseDto.getAddress());
        assertEquals("place123", responseDto.getPlaceId());
        assertEquals("photo123", responseDto.getPhotoReference());
        assertEquals(4.5, responseDto.getRating());
        assertEquals(true, responseDto.getOpenNow());

        verify(userRepository).findByEmail("test@example.com");
        verify(favoriteRepository).findByUser(testUser);
    }

    @Test
    void getFavoritesByEmail_ShouldThrowException_WhenUserNotFound() {
        // Given
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // When & Then
        UsernameNotFoundException exception = assertThrows(UsernameNotFoundException.class,
                () -> favoriteService.getFavoritesByEmail("nonexistent@example.com"));

        assertEquals("Utilisateur introuvable", exception.getMessage());
        verify(userRepository).findByEmail("nonexistent@example.com");
        verify(favoriteRepository, never()).findByUser(any(User.class));
    }

    @Test
    void addFavorite_ShouldSaveFavorite_WhenUserExistsAndFavoriteNotExists() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(favoriteRepository.existsByUserAndPlaceId(testUser, "place123")).thenReturn(false);
        when(favoriteRepository.save(any(Favorite.class))).thenReturn(testFavorite);

        // When
        favoriteService.addFavorite("test@example.com", testFavoriteDto);

        // Then
        verify(userRepository).findByEmail("test@example.com");
        verify(favoriteRepository).existsByUserAndPlaceId(testUser, "place123");
        verify(favoriteRepository).save(any(Favorite.class));
    }

    @Test
    void addFavorite_ShouldNotSave_WhenFavoriteAlreadyExists() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(favoriteRepository.existsByUserAndPlaceId(testUser, "place123")).thenReturn(true);

        // When
        favoriteService.addFavorite("test@example.com", testFavoriteDto);

        // Then
        verify(userRepository).findByEmail("test@example.com");
        verify(favoriteRepository).existsByUserAndPlaceId(testUser, "place123");
        verify(favoriteRepository, never()).save(any(Favorite.class));
    }

    @Test
    void addFavorite_ShouldThrowException_WhenUserNotFound() {
        // Given
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> favoriteService.addFavorite("nonexistent@example.com", testFavoriteDto));

        assertEquals("Utilisateur non trouvé : nonexistent@example.com", exception.getMessage());
        verify(userRepository).findByEmail("nonexistent@example.com");
        verify(favoriteRepository, never()).save(any(Favorite.class));
    }

    @Test
    void removeFavorite_ShouldDeleteFavorite_WhenUserExists() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // When
        favoriteService.removeFavorite("test@example.com", "place123");

        // Then
        verify(userRepository).findByEmail("test@example.com");
        verify(favoriteRepository).deleteByUserAndPlaceId(testUser, "place123");
    }

    @Test
    void removeFavorite_ShouldThrowException_WhenUserNotFound() {
        // Given
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> favoriteService.removeFavorite("nonexistent@example.com", "place123"));

        assertEquals("Utilisateur non trouvé : nonexistent@example.com", exception.getMessage());
        verify(userRepository).findByEmail("nonexistent@example.com");
        verify(favoriteRepository, never()).deleteByUserAndPlaceId(any(User.class), anyString());
    }

    @Test
    void deleteFavoriteByPlaceId_ShouldDeleteFavorite_WhenFavoriteExists() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(favoriteRepository.existsByUserAndPlaceId(testUser, "place123")).thenReturn(true);

        // When
        favoriteService.deleteFavoriteByPlaceId("test@example.com", "place123");

        // Then
        verify(userRepository).findByEmail("test@example.com");
        verify(favoriteRepository).existsByUserAndPlaceId(testUser, "place123");
        verify(favoriteRepository).deleteByUserAndPlaceId(testUser, "place123");
    }

    @Test
    void deleteFavoriteByPlaceId_ShouldThrowException_WhenFavoriteNotFound() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(favoriteRepository.existsByUserAndPlaceId(testUser, "place123")).thenReturn(false);

        // When & Then
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> favoriteService.deleteFavoriteByPlaceId("test@example.com", "place123"));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Favori non trouvé pour ce lieu", exception.getReason());

        verify(userRepository).findByEmail("test@example.com");
        verify(favoriteRepository).existsByUserAndPlaceId(testUser, "place123");
        verify(favoriteRepository, never()).deleteByUserAndPlaceId(any(User.class), anyString());
    }
}