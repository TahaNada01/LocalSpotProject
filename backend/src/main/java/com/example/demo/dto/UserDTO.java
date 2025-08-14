package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String nom;
    private String email;
    private String adresse;
    private String ville;
    private String profilPhoto;
    private String role;
}
