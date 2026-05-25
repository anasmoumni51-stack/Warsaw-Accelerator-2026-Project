package com.sumup.moumni.salonapi.Controller;

import com.sumup.moumni.salonapi.Dto.PageableDTO;
import com.sumup.moumni.salonapi.Dto.SalonDetailDTO;
import com.sumup.moumni.salonapi.Dto.SalonFilterDTO;
import com.sumup.moumni.salonapi.Dto.SalonSummaryDTO;
import com.sumup.moumni.salonapi.Dto.SalonUpdateDTO;
import com.sumup.moumni.salonapi.Service.SalonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/salons")
@AllArgsConstructor
@Tag(name = "Salon", description = "Beauty salon management APIs")
public class SalonController {

    private final SalonService salonService;

    @GetMapping
    @Operation(summary = "Get all salons ( paginated )", description = "Retrieve a paginated list of salons with optional filtering")
    public Page<SalonSummaryDTO> getAllSalons(
            @Valid SalonFilterDTO filterDTO,
            @Valid PageableDTO pageableDTO) {
        return salonService.getAllSalons(filterDTO.getDistrict(), filterDTO.getService(), pageableDTO);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get salon by ID", description = "Retrieve detailed information about a specific salon")
    public SalonDetailDTO getSalonById(
            @Parameter(description = "Salon ID", required = true) 
            @PathVariable Long id) {
        return salonService.getSalonById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update salon", description = "Update an existing salon's information")
    public SalonDetailDTO updateSalon(
            @Parameter(description = "Salon ID", required = true) 
            @PathVariable Long id,
            @Valid @RequestBody SalonUpdateDTO updateDTO) {
        return salonService.updateSalon(id, updateDTO);
    }
}
