package com.sumup.moumni.salonapi.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@Schema(description = "Pagination parameters")
public class PageableDTO {

    @Schema(description = "Page number (zero-based)", example = "0")
    @Min(value = 0, message = "Page must be at least 0")
    @Max(value = 200, message = "Page must be at most 200")
    private int page = 0;

    @Schema(description = "Page size (1-100)", example = "20")
    @Min(value = 1, message = "Size must be at least 1")
    @Max(value = 100, message = "Size must be at most 100")
    private int size = 20;

    @Schema(description = "Sort fields allowed are : rating, priceRange, name, reviewCount", example = "rating")
    @Pattern(regexp = "^(rating|priceRange|name|reviewCount)$", message = "Invalid sort field. Allowed: rating, priceRange, name, reviewCount")
    private String sort = "reviewCount";

    @Schema(description = "Sort order (ASC or DESC)", example = "DESC")
    @Pattern(regexp = "^(ASC|DESC)$", message = "Order must be ASC or DESC")
    private String orderBy = "DESC";
}
