package com.sumup.moumni.salonapi.Controller;

import com.sumup.moumni.salonapi.Dto.SalonDetailDTO;
import com.sumup.moumni.salonapi.Dto.SalonSummaryDTO;
import com.sumup.moumni.salonapi.Dto.SalonUpdateDTO;
import com.sumup.moumni.salonapi.Service.SalonService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/salons")
@AllArgsConstructor
public class SalonController {

    private final SalonService salonService;

    @GetMapping
    public Page<SalonSummaryDTO> getAllSalons(
            @RequestParam(name = "district", required = false) String district,
            @RequestParam(name = "service", required = false) String service,
            Pageable pageable) {
        return salonService.getAllSalons(district, service, pageable);
    }

    @GetMapping("/{id}")
    public SalonDetailDTO getSalonById(@PathVariable Long id) {
        return salonService.getSalonById(id);
    }

    @PutMapping("/{id}")
    public SalonDetailDTO updateSalon(
            @PathVariable Long id,
            @Valid @RequestBody SalonUpdateDTO updateDTO) {
        return salonService.updateSalon(id, updateDTO);
    }
}
