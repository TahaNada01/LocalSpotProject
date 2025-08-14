// src/main/java/com/example/demo/controllers/UserPlacesController.java
package com.example.demo.controllers;

import com.example.demo.dto.CreateUserPlaceRequest;
import com.example.demo.dto.UpdateUserPlaceRequest;
import com.example.demo.dto.UserPlaceResponse;
import com.example.demo.services.UserPlaceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    // PATCH + PUT sur le même handler, et on accepte "place" (POJO) OU "data" (String JSON)
    @PreAuthorize("isAuthenticated()")
    @RequestMapping(
            value = "/{id}",
            method = { RequestMethod.PATCH, RequestMethod.PUT },
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UserPlaceResponse> upsert(
            @PathVariable Long id,
            @RequestPart(value="place", required=false) UpdateUserPlaceRequest place,
            @RequestPart(value="data",  required=false) String dataJson,
            @RequestPart(value="photo", required=false) MultipartFile photo,
            Principal principal
    ) throws Exception {

        UpdateUserPlaceRequest payload = place;
        if (payload == null) {
            payload = (dataJson == null || dataJson.isBlank())
                    ? new UpdateUserPlaceRequest()
                    : objectMapper.readValue(dataJson, UpdateUserPlaceRequest.class);
        }

        return ResponseEntity.ok(service.update(id, payload, photo, principal.getName()));
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
