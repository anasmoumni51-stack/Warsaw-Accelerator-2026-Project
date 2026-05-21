package com.sumup.moumni.salonapi.Dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class SalonSummaryDTO {
    Long id;
    String name;
    String district;
    BigDecimal rating;
    String priceRange;
}
