package com.example.demo.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "user_places", indexes = {
        @Index(name = "idx_user_places_created_by", columnList = "created_by_id")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UserPlace {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, length=120) private String name;
    @Column(nullable=false, length=40)  private String category;
    @Column(nullable=false, length=160) private String addressLine;
    @Column(nullable=false, length=80)  private String city;
    @Column(nullable=false, length=10)  private String postalCode;
    @Column(nullable=false, length=60)  private String country;
    @Column(nullable=false, length=220) private String shortDescription;


    @Column(length=3) private String priceRange; // "€", "€€", "€€€"
    private Integer avgPrice;

    @Column(columnDefinition = "TEXT")
    private String openingHoursJson;

    @Column(length=300) private String imageUrl; // /media/xxx.jpg

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private Status status = Status.PENDING;
    public enum Status { PENDING, APPROVED, REJECTED }

    @Column(nullable=false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
