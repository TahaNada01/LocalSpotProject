// src/main/java/com/example/demo/services/UserPlaceService.java
package com.example.demo.services;

import com.example.demo.dto.CreateUserPlaceRequest;
import com.example.demo.dto.UpdateUserPlaceRequest;
import com.example.demo.dto.UserPlaceResponse;
import com.example.demo.entities.User;
import com.example.demo.entities.UserPlace;
import com.example.demo.exceptions.ForbiddenException;
import com.example.demo.exceptions.NotFoundException;
import com.example.demo.repositories.UserPlaceRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class UserPlaceService {
    private final UserPlaceRepository placeRepo;
    private final UserRepository userRepo;
    private final FileStorageService storage;

    public UserPlaceService(UserPlaceRepository placeRepo, UserRepository userRepo, FileStorageService storage) {
        this.placeRepo = placeRepo; this.userRepo = userRepo; this.storage = storage;
    }

    // ===========================
    // Mes places (privé)
    // ===========================
    public List<UserPlaceResponse> listMine(String email){
        User me = userRepo.findByEmail(email).orElseThrow(() -> new NotFoundException("User not found"));
        return placeRepo.findAllByCreatedBy_Id(me.getId())
                .stream()
                .map(p -> toDto(p))
                .toList();
    }

    public UserPlaceResponse getMine(Long id, String email){
        User me = userRepo.findByEmail(email).orElseThrow(() -> new NotFoundException("User not found"));
        UserPlace p = placeRepo.findByIdAndCreatedBy_Id(id, me.getId())
                .orElseThrow(() -> new NotFoundException("Place not found"));
        return toDto(p);
    }

    @Transactional
    public UserPlaceResponse create(CreateUserPlaceRequest r, MultipartFile photo, String userEmail) throws Exception {
        User author = userRepo.findByEmail(userEmail).orElseThrow(() -> new NotFoundException("User not found"));

        String imageUrl = storage.savePlaceImage(photo);

        UserPlace e = new UserPlace();
        e.setName(r.name());
        e.setCategory(r.category());
        e.setAddressLine(r.addressLine());
        e.setCity(r.city());
        e.setPostalCode(r.postalCode());
        e.setCountry(r.country());
        e.setShortDescription(r.shortDescription());
        e.setPriceRange((r.priceRange()==null || r.priceRange().isBlank()) ? null : r.priceRange());
        e.setAvgPrice(r.avgPrice());
        e.setOpeningHoursJson(r.openingHoursJson());   // NEW
        e.setImageUrl(imageUrl);
        e.setCreatedBy(author);

        UserPlace saved = placeRepo.save(e);
        return toDto(saved);
    }

    @Transactional
    public UserPlaceResponse update(Long id, UpdateUserPlaceRequest r, MultipartFile newPhoto, String userEmail) throws Exception {
        User me = userRepo.findByEmail(userEmail).orElseThrow(() -> new NotFoundException("User not found"));
        UserPlace place = placeRepo.findById(id).orElseThrow(() -> new NotFoundException("Place not found"));
        if (!place.getCreatedBy().getId().equals(me.getId())) throw new ForbiddenException("You cannot update this place");

        if (r.getName()!=null) place.setName(r.getName());
        if (r.getCategory()!=null) place.setCategory(r.getCategory());
        if (r.getAddressLine()!=null) place.setAddressLine(r.getAddressLine());
        if (r.getCity()!=null) place.setCity(r.getCity());
        if (r.getPostalCode()!=null) place.setPostalCode(r.getPostalCode());
        if (r.getCountry()!=null) place.setCountry(r.getCountry());
        if (r.getShortDescription()!=null) place.setShortDescription(r.getShortDescription());
        if (r.getPriceRange()!=null) place.setPriceRange(r.getPriceRange().isBlank()? null : r.getPriceRange());
        if (r.getAvgPrice()!=null) place.setAvgPrice(r.getAvgPrice());
        if (r.getOpeningHoursJson()!=null) place.setOpeningHoursJson(r.getOpeningHoursJson()); // NEW

        if (newPhoto != null && !newPhoto.isEmpty()) {
            storage.deleteByPublicUrl(place.getImageUrl());
            place.setImageUrl(storage.savePlaceImage(newPhoto));
        }

        UserPlace saved = placeRepo.save(place);
        return toDto(saved);
    }

    @Transactional
    public void delete(Long placeId, String userEmail) {
        User me = userRepo.findByEmail(userEmail).orElseThrow(() -> new NotFoundException("User not found"));
        UserPlace place = placeRepo.findById(placeId).orElseThrow(() -> new NotFoundException("Place not found"));
        if (!place.getCreatedBy().getId().equals(me.getId())) throw new ForbiddenException("You cannot delete this place");

        storage.deleteByPublicUrl(place.getImageUrl());
        placeRepo.delete(place);
    }

    // ===========================
    // Public / Community
    // ===========================

    /**
     * Liste publique paginée (status = APPROVED) avec filtres optionnels.
     * Tri par createdAt DESC.
     */
    public Page<UserPlaceResponse> listPublic(int page, int size, String city, String category) {
        int p = Math.max(0, page);
        int s = Math.max(1, Math.min(50, size)); // borne de sécurité
        Pageable pageable = PageRequest.of(p, s, Sort.by(Sort.Direction.DESC, "createdAt"));

        String cityQ = city == null ? "" : city.trim();
        String catQ  = category == null ? "" : category.trim();

        Page<UserPlace> result;
        if (cityQ.isEmpty() && catQ.isEmpty()) {
            // toutes les places approuvées
            result = placeRepo.findAllByStatus(UserPlace.Status.APPROVED, pageable);
        } else {
            // filtre city + category (les valeurs vides fonctionnent comme "contains ''")
            result = placeRepo.findAllByStatusAndCityIgnoreCaseContainingAndCategoryIgnoreCaseContainingOrderByCreatedAtDesc(
                    UserPlace.Status.APPROVED, cityQ, catQ, pageable
            );
        }

        return result.map(this::toDto);
    }

    /**
     * Détail d'une place publique (seulement si APPROVED).
     */
    public UserPlaceResponse getPublic(Long id) {
        UserPlace p = placeRepo.findById(id).orElseThrow(() -> new NotFoundException("Place not found"));
        if (p.getStatus() != UserPlace.Status.APPROVED) {
            // on masque les non-validées/rejetées
            throw new NotFoundException("Place not found");
        }
        return toDto(p);
    }

    // ===========================
    // Mapper
    // ===========================
    private UserPlaceResponse toDto(UserPlace p) {
        Long createdById = (p.getCreatedBy() != null) ? p.getCreatedBy().getId() : null;
        return new UserPlaceResponse(
                p.getId(),
                p.getName(),
                p.getImageUrl(),
                createdById,
                p.getOpeningHoursJson()
        );
    }
}
