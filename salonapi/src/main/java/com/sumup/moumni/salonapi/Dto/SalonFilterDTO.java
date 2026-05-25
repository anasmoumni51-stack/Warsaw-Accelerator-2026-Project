package com.sumup.moumni.salonapi.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Filter parameters for salon search")
public class SalonFilterDTO {

    @Schema(description = "Filter by Warsaw district name", example = "Śródmieście")
    @Size(max = 100, message = "District name must not exceed 100 characters")
    private String district;

    @Schema(description = "Filter by service type", example = "Hair Styling")
    @Size(max = 100, message = "Service name must not exceed 100 characters")
    private String service;
}
