package com.sumup.moumni.salonapi.Dto;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
@Schema(description = "DTO for updating salon information")
public class SalonUpdateDTO {

    @Schema(description = "Salon business name", example = "Beauty Studio")
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @Schema(description = "Street address", example = "Marszałkowska 1")
    @NotBlank(message = "Address is required")
    @Size(max = 100, message = "Address must not exceed 100 characters")
    private String address;

    @Schema(description = "Street number", example = "1", nullable = true)
    @Size(max = 50, message = "Street number must not exceed 50 characters")
    private String streetNumber;

    @Schema(description = "City name", example = "Warszawa")
    @Size(max = 50, message = "City must not exceed 50 characters")
    @NotBlank(message = "City is required")
    private String city;

    @Schema(description = "Country name", example = "Poland")
    @Size(max = 50, message = "Country must not exceed 50 characters")
    @NotBlank(message = "Country is required")
    private String country;

    @Schema(description = "Postal code", example = "00-001")
    @Size(max = 20, message = "Postcode must not exceed 20 characters")
    @NotBlank(message = "Postcode is required")
    private String postcode;

    @Schema(description = "Warsaw district", example = "Śródmieście")
    @NotBlank(message = "District is required")
    @Size(max = 50, message = "District must not exceed 50 characters")
    private String district;

    @Schema(description = "Phone number with country code", example = "+48 111 222 333")
    @Size(max = 30, message = "Phone must not exceed 30 characters")
    private String phone;

    @Schema(description = "Business website URL", example = "https://beautywebsite.pl")
    @URL(message = "Invalid URL format")
    @Size(max = 200, message = "Website must not exceed 200 characters")
    private String website;

    @ArraySchema(schema = @Schema(description = "Service offered", example = "Hair Styling"))
    @NotEmpty(message = "At least one service is required")
    @Size(max = 50, message = "Cannot have more than 50 services")
    private List<String> services;

    @Schema(description = "Price range category (zł, zł zł, or zł zł zł)", example = "zł zł")
    @NotBlank(message = "priceRange is required")
    @Size(max = 20, message = "Price range must not exceed 20 characters")
    private String priceRange;

    @Schema(description = "Average rating (0-5 scale)", example = "4.8")
    @NotNull(message = "Rating is required")
    @Min(value = 0, message = "Rating must be at least 0")
    @Max(value = 5, message = "Rating must be at most 5")
    private BigDecimal rating;

    @Schema(description = "Number of customer reviews", example = "156")
    @Min(value = 0, message = "Review count must be at least 0")
    @NotNull(message = "Review count is required")
    private Integer reviewCount;
}
