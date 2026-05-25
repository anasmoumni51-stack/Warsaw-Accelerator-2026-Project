package com.sumup.moumni.salonapi.Service;

import com.sumup.moumni.salonapi.Dto.PageableDTO;
import com.sumup.moumni.salonapi.Dto.SalonDetailDTO;
import com.sumup.moumni.salonapi.Dto.SalonSummaryDTO;
import com.sumup.moumni.salonapi.Dto.SalonUpdateDTO;
import com.sumup.moumni.salonapi.Entity.Salon;
import com.sumup.moumni.salonapi.Entity.Services;
import com.sumup.moumni.salonapi.Common.Exception.SalonNotFoundException;
import com.sumup.moumni.salonapi.Mapper.SalonMapper;
import com.sumup.moumni.salonapi.Repository.SalonRepository;
import com.sumup.moumni.salonapi.Repository.ServiceRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class SalonService {

    private final SalonRepository salonRepository;
    private final ServiceRepository serviceRepository;
    private final SalonMapper salonMapper;



    public Page<SalonSummaryDTO> getAllSalons(
            String district,
            String serviceName,
            PageableDTO pageableDTO
    ) {
        Page<Salon> salons;
        Sort sort = Sort.by(Sort.Direction.fromString(pageableDTO.getOrderBy()), pageableDTO.getSort());
        Pageable pageable = PageRequest.of(pageableDTO.getPage(), pageableDTO.getSize(), sort);

        boolean hasDistrict = district != null && !district.isEmpty();
        boolean hasServiceName = serviceName != null && !serviceName.isEmpty();

        if (hasDistrict && hasServiceName) {
            salons = salonRepository.findByDistrictAndServicesName(district, serviceName, pageable);
        } else if (hasDistrict) {
            salons = salonRepository.findByDistrict(district, pageable);
        } else if (hasServiceName) {
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

    @Transactional
    public SalonDetailDTO updateSalon(Long id, SalonUpdateDTO updateDTO) {
        var salon = salonRepository.findById(id).orElse(null);
        if (salon == null) {
            throw new SalonNotFoundException();
        }
        salonMapper.updateSalonFromDTO(updateDTO, salon);


        if (updateDTO.getServices() != null) {
            List<Services> found = serviceRepository.findByNameIn(updateDTO.getServices());
            salon.setServices(new HashSet<>(found));
        }

        salonRepository.save(salon);

        return salonMapper.toDetailDTO(salon);
    }

}