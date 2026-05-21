package com.sumup.moumni.salonapi.Repository;

import com.sumup.moumni.salonapi.Entity.Salon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalonRepository extends JpaRepository<Salon, Long> {

    Page<Salon> findByDistrict(String district, Pageable pageable);

    Page<Salon> findByServicesName(String serviceName, Pageable pageable);

    Page<Salon> findByDistrictAndServicesName(String district, String serviceName, Pageable pageable);
}
