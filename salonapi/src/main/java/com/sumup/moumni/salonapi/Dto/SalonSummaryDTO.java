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
    Long id;

    @Schema(description = "Salon business name", example = "Beauty Studio")
    String name;

    @Schema(description = "Warsaw district", example = "Śródmieście")
    String district;

    @Schema(description = "Average rating (0-5 scale)", example = "4.8")
    BigDecimal rating;

    @Schema(description = "Price range category (zł, zł zł, or zł zł zł)", example = "zł zł")
    String priceRange;

    @Schema(description = "Salon cover image URL", example = "https://lh3.googleusercontent.com/...", nullable = true)
    String imageUrl;

    @Schema(description = "Latitude coordinate", example = "52.2297", nullable = true)
    Double lat;

    @Schema(description = "Longitude coordinate", example = "21.0122", nullable = true)
    Double lng;

    @ArraySchema(schema = @Schema(description = "Service offered", example = "Hair Styling"))
    List<String> services;

    @Schema(description = "Number of customer reviews", example = "156")
    Integer reviewCount;
}
