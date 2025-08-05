package com.example.demo.controllers;

import com.example.demo.dto.FavoriteDto;
import com.example.demo.dto.FavoriteResponseDto;
import com.example.demo.entities.Favorite;
import com.example.demo.entities.User;
import com.example.demo.services.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    // récupérer les favoris de l'utilisateur
    @GetMapping
    public List<FavoriteResponseDto> getFavorites(@AuthenticationPrincipal User user) {
        return favoriteService.getFavoritesByEmail(user.getEmail());
    }

    //ajouter un favori à partir d’un DTO
    @PostMapping
    public void addFavorite(@AuthenticationPrincipal User user, @RequestBody FavoriteDto favoriteDto) {
        favoriteService.addFavorite(user.getEmail(), favoriteDto);
    }

    // Supprimer un favori par placeId
    @DeleteMapping("/{placeId}")
    public ResponseEntity<?> deleteFavorite(@AuthenticationPrincipal User user,
                                            @PathVariable String placeId) {
        System.out.println("Utilisateur connecté : " + user.getEmail());

        favoriteService.deleteFavoriteByPlaceId(user.getEmail(), placeId);
        return ResponseEntity.ok("Favori supprimé.");
    }

}
