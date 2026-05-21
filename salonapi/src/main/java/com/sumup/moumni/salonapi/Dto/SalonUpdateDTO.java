package com.sumup.moumni.salonapi.Dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class SalonUpdateDTO {

    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    String name;

    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    String address;

    @NotBlank(message = "District is required")
    String district;

    @NotBlank(message = "Phone is required")
    @Size(max = 30, message = "Phone must not exceed 30 characters")
    String phone;

    @NotBlank(message = "Website is required")
    @Size(max = 500, message = "Website must not exceed 500 characters")
    String website;

    @NotNull(message = "Rating is required")
    @Min(value = 0, message = "Rating must be at least 0")
    @Max(value = 5, message = "Rating must be at most 5")
    BigDecimal rating;

    @NotNull(message = "Review count is required")
    @Min(value = 0, message = "Review count must be at least 0")
    Integer reviewCount;
}
