package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteDto {
    private String name;
    private String address;
    private String placeId;
    private String photoReference;
    private Double rating;
    private Boolean openNow;
}
