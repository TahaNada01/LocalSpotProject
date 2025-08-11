// src/main/java/com/example/demo/repositories/UserPlaceRepository.java
package com.example.demo.repositories;

import com.example.demo.entities.UserPlace;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserPlaceRepository extends JpaRepository<UserPlace, Long> {

    // === EXISTANT (mes places) ===
    Optional<UserPlace> findByIdAndCreatedBy_Id(Long id, Long userId);
    List<UserPlace> findAllByCreatedBy_Id(Long userId);

    // === PUBLIC (community) ===

    // Liste publique simple (on pourra trier via Pageable, ou utiliser la variante ci-dessous)
    Page<UserPlace> findAllByStatus(UserPlace.Status status, Pageable pageable);

    // Variante avec tri intégré dans la signature (utilisée si tu préfères)
    Page<UserPlace> findAllByStatusOrderByCreatedAtDesc(UserPlace.Status status, Pageable pageable);

    // Filtres simples city/category + tri récent
    Page<UserPlace> findAllByStatusAndCityIgnoreCaseContainingAndCategoryIgnoreCaseContainingOrderByCreatedAtDesc(
            UserPlace.Status status,
            String city,
            String category,
            Pageable pageable
    );
}
