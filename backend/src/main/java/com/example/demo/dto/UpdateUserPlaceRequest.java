package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateUserPlaceRequest {
    @Nullable @Size(min=2, max=120) private String name;
    @Nullable private String category;
    @Nullable private String addressLine;
    @Nullable private String city;
    @Nullable @Size(min=3, max=10) private String postalCode;
    @Nullable private String country;
    @Nullable @Size(max=200) private String shortDescription;
    @Nullable @Pattern(regexp="^$|€{1,3}$") private String priceRange; // "", "€", "€€", "€€€"
    @Nullable private Integer avgPrice;
    @Nullable @Size(max=4000) private String openingHoursJson;

    // getters & setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
    public String getPriceRange() { return priceRange; }
    public void setPriceRange(String priceRange) { this.priceRange = priceRange; }
    public Integer getAvgPrice() { return avgPrice; }
    public void setAvgPrice(Integer avgPrice) { this.avgPrice = avgPrice; }
    public String getOpeningHoursJson() { return openingHoursJson; }
    public void setOpeningHoursJson(String openingHoursJson) { this.openingHoursJson = openingHoursJson; }
}
