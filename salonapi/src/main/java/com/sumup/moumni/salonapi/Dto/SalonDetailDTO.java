package com.sumup.moumni.salonapi.Dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class SalonDetailDTO {
    Long id;
    String name;
    String address;
    String district;
    String phone;
    String website;
    List<String> services;
    String priceRange;
    BigDecimal rating;
    Integer reviewCount;
}
