package com.sumup.moumni.salonapi.Repository;

import com.sumup.moumni.salonapi.Entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<Services, Long> {

    Optional<Services> findByName(String name);
}
