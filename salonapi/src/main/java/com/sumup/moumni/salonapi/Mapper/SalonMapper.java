package com.sumup.moumni.salonapi.Mapper;

import com.sumup.moumni.salonapi.Dto.SalonDetailDTO;
import com.sumup.moumni.salonapi.Dto.SalonSummaryDTO;
import com.sumup.moumni.salonapi.Dto.SalonUpdateDTO;
import com.sumup.moumni.salonapi.Entity.Salon;
import com.sumup.moumni.salonapi.Entity.Services;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface SalonMapper {

    SalonSummaryDTO toSummaryDTO(Salon salon);

    SalonDetailDTO toDetailDTO(Salon salon);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateSalonFromDTO(SalonUpdateDTO dto, @MappingTarget Salon salon);

    default String map(Services service) {
        return service.getName();
    }
}
