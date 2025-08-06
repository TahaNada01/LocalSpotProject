package com.example.demo.services;

import com.example.demo.dto.FavoriteDto;
import com.example.demo.dto.FavoriteResponseDto;
import com.example.demo.repositories.FavoriteRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.entities.Favorite;
import com.example.demo.entities.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private UserRepository userRepository;

    public List<FavoriteResponseDto> getFavoritesByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));

        List<Favorite> favorites = favoriteRepository.findByUser(user);

        return favorites.stream().map(fav -> new FavoriteResponseDto(
                fav.getName(),
                fav.getAddress(),
                fav.getPlaceId(),
                fav.getPhotoReference(),
                fav.getRating(),
                fav.getOpenNow()
        )).collect(Collectors.toList());
    }


    public void addFavorite(String email, FavoriteDto favoriteDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé : " + email));

        if (!favoriteRepository.existsByUserAndPlaceId(user, favoriteDto.getPlaceId())) {
            Favorite favorite = Favorite.builder()
                    .name(favoriteDto.getName())
                    .address(favoriteDto.getAddress())
                    .placeId(favoriteDto.getPlaceId())
                    .photoReference(favoriteDto.getPhotoReference())
                    .rating(favoriteDto.getRating())
                    .openNow(favoriteDto.getOpenNow())
                    .user(user)
                    .build();

            favoriteRepository.save(favorite);
        }
    }

    public void removeFavorite(String email, String placeId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé : " + email));
        favoriteRepository.deleteByUserAndPlaceId(user, placeId);
    }

    @Transactional
    public void deleteFavoriteByPlaceId(String email, String placeId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        boolean exists = favoriteRepository.existsByUserAndPlaceId(user, placeId);

        if (!exists) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Favori non trouvé pour ce lieu");
        }

        favoriteRepository.deleteByUserAndPlaceId(user, placeId);
    }

}

