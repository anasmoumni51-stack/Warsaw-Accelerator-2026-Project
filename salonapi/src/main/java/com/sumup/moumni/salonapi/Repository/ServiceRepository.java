package com.sumup.moumni.salonapi.Repository;

import com.sumup.moumni.salonapi.Entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<Services, Long> {

    List<Services> findByNameIn(List<String> services);
}
