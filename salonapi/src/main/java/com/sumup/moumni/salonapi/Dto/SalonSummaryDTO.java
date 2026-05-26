package com.sumup.moumni.salonapi.Dto;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "Salon summary information for list views")
public class SalonSummaryDTO {

    @Schema(description = "Unique salon identifier", example = "1")
    private Long id;

    @Schema(description = "Salon business name", example = "Beauty Studio")
    private String name;

    @Schema(description = "Warsaw district", example = "Śródmieście")
    private String district;

    @Schema(description = "Average rating (0-5 scale)", example = "4.8")
    private BigDecimal rating;

    @Schema(description = "Price range category (zł, zł zł, or zł zł zł)", example = "zł zł")
    private String priceRange;

    @Schema(description = "Salon cover image URL", example = "https://lh3.googleusercontent.com/...", nullable = true)
    private String imageUrl;

    @Schema(description = "Latitude coordinate", example = "52.2297", nullable = true)
    private Double lat;

    @Schema(description = "Longitude coordinate", example = "21.0122", nullable = true)
    private Double lng;

    @ArraySchema(schema = @Schema(description = "Service offered", example = "Hair Styling"))
    private List<String> services;

    @Schema(description = "Number of customer reviews", example = "156")
    private Integer reviewCount;
}
