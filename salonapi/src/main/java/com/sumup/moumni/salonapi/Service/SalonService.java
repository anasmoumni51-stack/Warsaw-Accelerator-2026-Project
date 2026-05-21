package com.sumup.moumni.salonapi.Service;

import com.sumup.moumni.salonapi.Dto.SalonDetailDTO;
import com.sumup.moumni.salonapi.Dto.SalonSummaryDTO;
import com.sumup.moumni.salonapi.Dto.SalonUpdateDTO;
import com.sumup.moumni.salonapi.Entity.Salon;
import com.sumup.moumni.salonapi.Common.Exception.SalonNotFoundException;
import com.sumup.moumni.salonapi.Mapper.SalonMapper;
import com.sumup.moumni.salonapi.Repository.SalonRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SalonService {

    private final SalonRepository salonRepository;
    private final SalonMapper salonMapper;

    public Page<SalonSummaryDTO> getAllSalons(String district, String serviceName, Pageable pageable) {
        Page<Salon> salons;
        if (district != null && serviceName != null) {
            salons = salonRepository.findByDistrictAndServicesName(district, serviceName, pageable);
        } else if (district != null) {
            salons = salonRepository.findByDistrict(district, pageable);
        } else if (serviceName != null) {
            salons = salonRepository.findByServicesName(serviceName, pageable);
        } else {
            salons = salonRepository.findAll(pageable);
        }
        return salons.map(salonMapper::toSummaryDTO);
    }

    public SalonDetailDTO getSalonById(Long id) {
        var salon = salonRepository.findById(id).orElse(null);
        if (salon == null) {
            throw new SalonNotFoundException();
        }
        return salonMapper.toDetailDTO(salon);
    }

    public SalonDetailDTO updateSalon(Long id, SalonUpdateDTO updateDTO) {
        var salon = salonRepository.findById(id).orElse(null);
        if (salon == null) {
            throw new SalonNotFoundException();
        }
        salonMapper.updateSalonFromDTO(updateDTO, salon);
        salonRepository.save(salon);

        return salonMapper.toDetailDTO(salon);
    }
}
