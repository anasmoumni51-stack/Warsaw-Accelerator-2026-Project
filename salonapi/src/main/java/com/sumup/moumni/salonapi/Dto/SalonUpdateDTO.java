package com.sumup.moumni.salonapi.Dto;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "DTO for updating salon information")
public class SalonUpdateDTO {

    @Schema(description = "Salon business name", example = "Beauty Studio")
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    String name;

    @Schema(description = "Street address", example = "Marszałkowska 1")
    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    String address;

    @Schema(description = "Street number", example = "1", nullable = true)
    @Size(max = 50, message = "Street number must not exceed 50 characters")
    String streetNumber;

    @Schema(description = "City name", example = "Warszawa")
    @Size(max = 100, message = "City must not exceed 100 characters")
    @NotBlank(message = "City is required")
    String city;

    @Schema(description = "Country name", example = "Poland")
    @Size(max = 100, message = "Country must not exceed 100 characters")
    @NotBlank(message = "City is required")
    String country;

    @Schema(description = "Postal code", example = "00-001")
    @Size(max = 20, message = "Postcode must not exceed 20 characters")
    @NotBlank(message = "City is required")
    String postcode;

    @Schema(description = "Warsaw district", example = "Śródmieście")
    @NotBlank(message = "District is required")
    @Size(max = 100, message = "District must not exceed 100 characters")
    String district;

    @Schema(description = "Phone number with country code", example = "+48 111 222 333")
    @NotBlank(message = "Phone is required")
    @Size(max = 30, message = "Phone must not exceed 30 characters")
    String phone;

    @Schema(description = "Business website URL", example = "https://beautywebsite.pl")
    @NotBlank(message = "Website is required")
    @Size(max = 500, message = "Website must not exceed 500 characters")
    String website;

    @ArraySchema(schema = @Schema(description = "Service offered", example = "Hair Styling"))
    List<String> services;

    @Schema(description = "Price range category (zł, zł zł, or zł zł zł)", example = "zł zł")
    @NotBlank(message = "priceRange is required")
    @Size(max = 20, message = "Price range must not exceed 20 characters")
    String priceRange;

    @Schema(description = "Average rating (0-5 scale)", example = "4.8")
    @NotNull(message = "Rating is required")
    @Min(value = 0, message = "Rating must be at least 0")
    @Max(value = 5, message = "Rating must be at most 5")
    BigDecimal rating;

    @Schema(description = "Number of customer reviews", example = "156")
    @NotNull(message = "Review count is required")
    @Min(value = 0, message = "Review count must be at least 0")
    Integer reviewCount;
}
