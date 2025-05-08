package com.example.demo.controllers;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.UpdateUserRequest;
import com.example.demo.entities.User;
import com.example.demo.security.JwtUtil;
import com.example.demo.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    //Inscription
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userService.emailExists(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email déjà utilisé.");
        }

        User savedUser = userService.save(user);
        return ResponseEntity.ok(savedUser);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userService.findByEmail(loginRequest.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email incorrect");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(loginRequest.getMotDePasse(), user.getMotDePasse())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Mot de passe ou Email incorrect");
        }

        String accessToken = jwtUtil.generateToken(user.getEmail(), user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        return ResponseEntity.ok(new LoginResponse(accessToken, refreshToken));
    }


    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        if (!jwtUtil.isTokenValid(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }

        String email = jwtUtil.extractEmail(refreshToken);
        Optional<User> userOpt = userService.findByEmail(email);

        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");

        String newAccessToken = jwtUtil.generateToken(email, userOpt.get().getRole());
        return ResponseEntity.ok(new LoginResponse(newAccessToken, refreshToken)); // refresh token same
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Aucun token fourni");
        }

        String token = authHeader.substring(7);

        return ResponseEntity.ok("Déconnexion réussie");
    }


    //Suppression
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(@AuthenticationPrincipal User user) {
        userService.deleteUser(user.getEmail());
        return ResponseEntity.ok().body("Utilisateur supprimé.");
    }

    //Récuperer les infos de l'utilisateur connecté
    @GetMapping("/me")
    public ResponseEntity<?> getUserInfo(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    //update des infos user
    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@AuthenticationPrincipal User currentUser,
                                        @RequestBody UpdateUserRequest updateData) {

        User updated = userService.updateUserInfo(currentUser.getId(), updateData);



        // Re-génère un nouveau token après mise à jour
        String newToken = jwtUtil.generateToken(updated.getEmail(), updated.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(updated.getEmail());


        return ResponseEntity.ok(new LoginResponse(newToken, refreshToken));
    }


}
