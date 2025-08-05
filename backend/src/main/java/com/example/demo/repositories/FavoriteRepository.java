package com.example.demo.repositories;

import com.example.demo.entities.Favorite;
import com.example.demo.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);
    void deleteByUserAndPlaceId(User user, String placeId);
    boolean existsByUserAndPlaceId(User user, String placeId);
}
