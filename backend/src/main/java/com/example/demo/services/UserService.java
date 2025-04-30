package com.example.demo.services;

import com.example.demo.dto.UpdateUserRequest;
import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User save(User user) {
        user.setMotDePasse(passwordEncoder.encode(user.getMotDePasse()));
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public void deleteUser(String email) {
            User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("L'utilisateur n'existe pas"));
            userRepository.delete(user);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserInfo(String email, UpdateUserRequest newData) {
        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (newData.getNom() != null) existingUser.setNom(newData.getNom());
        if (newData.getAdresse() != null) existingUser.setAdresse(newData.getAdresse());
        if (newData.getVille() != null) existingUser.setVille(newData.getVille());
        if (newData.getProfilPhoto() != null) existingUser.setProfilPhoto(newData.getProfilPhoto());

        if (newData.getMotDePasse() != null && !newData.getMotDePasse().isBlank()) {
            existingUser.setMotDePasse(passwordEncoder.encode(newData.getMotDePasse()));
        }

        return userRepository.save(existingUser);
    }



}
