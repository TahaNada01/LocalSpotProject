package com.example.demo.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String nom;
    private String adresse;
    private String ville;
    private String profilPhoto;
    private String motDePasse;
}
