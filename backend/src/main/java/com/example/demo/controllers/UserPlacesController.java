package com.example.demo.controllers;

import com.example.demo.dto.CreateUserPlaceRequest;
import com.example.demo.dto.UserPlaceResponse;
import com.example.demo.services.UserPlaceService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.demo.dto.UpdateUserPlaceRequest;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/places/user")
public class UserPlacesController {
    private final UserPlaceService service;
    private final ObjectMapper objectMapper;

    public UserPlacesController(UserPlaceService service, ObjectMapper objectMapper){
        this.service = service;
        this.objectMapper = objectMapper;
    }


    @PreAuthorize("isAuthenticated()")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserPlaceResponse> create(
            @Valid @RequestPart("data") CreateUserPlaceRequest data,
            @RequestPart(value="photo", required=false) MultipartFile photo,
            Principal principal) throws Exception {
        return ResponseEntity.ok(service.create(data, photo, principal.getName()));
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) {
        service.delete(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping(value="/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserPlaceResponse> update(
            @PathVariable Long id,
            @RequestPart(value="data", required=false) String dataJson,
            @RequestPart(value="photo", required=false) MultipartFile photo,
            Principal principal) throws Exception {

        UpdateUserPlaceRequest data = (dataJson == null || dataJson.isBlank())
                ? new UpdateUserPlaceRequest()
                : objectMapper.readValue(dataJson, UpdateUserPlaceRequest.class);

        return ResponseEntity.ok(service.update(id, data, photo, principal.getName()));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/mine")
    public ResponseEntity<List<UserPlaceResponse>> mine(Principal principal){
        return ResponseEntity.ok(service.listMine(principal.getName()));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<UserPlaceResponse> getMine(@PathVariable Long id, Principal principal){
        return ResponseEntity.ok(service.getMine(id, principal.getName()));
    }
}


