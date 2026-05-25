package com.sumup.moumni.salonapi.Service;

import com.sumup.moumni.salonapi.Common.Exception.SalonNotFoundException;
import com.sumup.moumni.salonapi.Dto.PageableDTO;
import com.sumup.moumni.salonapi.Dto.SalonDetailDTO;
import com.sumup.moumni.salonapi.Dto.SalonSummaryDTO;
import com.sumup.moumni.salonapi.Dto.SalonUpdateDTO;
import com.sumup.moumni.salonapi.Entity.Salon;
import com.sumup.moumni.salonapi.Mapper.SalonMapper;
import com.sumup.moumni.salonapi.Repository.SalonRepository;
import com.sumup.moumni.salonapi.Repository.ServiceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SalonServiceTest {

    @Mock
    private SalonRepository salonRepository;

    @Mock
    private ServiceRepository serviceRepository;

    @Mock
    private SalonMapper salonMapper;

    @InjectMocks
    private SalonService salonService;

    private Salon sampleSalon;
    private SalonSummaryDTO sampleSummaryDTO;
    private SalonDetailDTO sampleDetailDTO;
    private PageableDTO defaultPageable;

    @BeforeEach
    void setUp() {
        sampleSalon = new Salon();
        sampleSalon.setId(1L);
        sampleSalon.setName("Beauty Studio");
        sampleSalon.setAddress("Marszałkowska 1");
        sampleSalon.setDistrict("Śródmieście");
        sampleSalon.setCity("Warszawa");
        sampleSalon.setCountry("Poland");
        sampleSalon.setPostcode("00-001");
        sampleSalon.setPhone("+48 111 222 333");
        sampleSalon.setWebsite("https://beautystudio.pl");
        sampleSalon.setPriceRange("zł zł");
        sampleSalon.setRating(new BigDecimal("4.8"));
        sampleSalon.setReviewCount(156);

        sampleSummaryDTO = new SalonSummaryDTO();
        sampleSummaryDTO.setId(1L);
        sampleSummaryDTO.setName("Beauty Studio");
        sampleSummaryDTO.setDistrict("Śródmieście");
        sampleSummaryDTO.setRating(new BigDecimal("4.8"));
        sampleSummaryDTO.setPriceRange("zł zł");
        sampleSummaryDTO.setReviewCount(156);

        sampleDetailDTO = new SalonDetailDTO();
        sampleDetailDTO.setId(1L);
        sampleDetailDTO.setName("Beauty Studio");
        sampleDetailDTO.setAddress("Marszałkowska 1");
        sampleDetailDTO.setDistrict("Śródmieście");
        sampleDetailDTO.setPhone("+48 111 222 333");
        sampleDetailDTO.setRating(new BigDecimal("4.8"));

        defaultPageable = new PageableDTO();
        defaultPageable.setPage(0);
        defaultPageable.setSize(20);
        defaultPageable.setSort("rating");
        defaultPageable.setOrderBy("DESC");
    }

    // ─── GET ALL SALONS ────────────────────────────────────────────────

    @Nested
    @DisplayName("getAllSalons")
    class GetAllSalons {

        @Test
        @DisplayName("no filters → calls findAll")
        void noFilters_returnsAllSalons() {
            Page<Salon> salonPage = new PageImpl<>(List.of(sampleSalon));
            when(salonRepository.findAll(any(Pageable.class))).thenReturn(salonPage);
            when(salonMapper.toSummaryDTO(sampleSalon)).thenReturn(sampleSummaryDTO);

            Page<SalonSummaryDTO> result = salonService.getAllSalons(null, null, defaultPageable);

            assertThat(result.getTotalElements()).isEqualTo(1);
            assertThat(result.getContent().get(0).getName()).isEqualTo("Beauty Studio");
            verify(salonRepository).findAll(any(Pageable.class));
        }

        @Test
        @DisplayName("district filter only → calls findByDistrict")
        void districtFilterOnly_callsFindByDistrict() {
            Page<Salon> salonPage = new PageImpl<>(List.of(sampleSalon));
            when(salonRepository.findByDistrict(eq("Śródmieście"), any(Pageable.class))).thenReturn(salonPage);
            when(salonMapper.toSummaryDTO(sampleSalon)).thenReturn(sampleSummaryDTO);

            Page<SalonSummaryDTO> result = salonService.getAllSalons("Śródmieście", null, defaultPageable);

            assertThat(result.getContent()).hasSize(1);
            verify(salonRepository).findByDistrict(eq("Śródmieście"), any(Pageable.class));
        }

        @Test
        @DisplayName("service filter only → calls findByServicesName")
        void serviceFilterOnly_callsFindByServicesName() {
            Page<Salon> salonPage = new PageImpl<>(List.of(sampleSalon));
            when(salonRepository.findByServicesName(eq("Hair Styling"), any(Pageable.class))).thenReturn(salonPage);
            when(salonMapper.toSummaryDTO(sampleSalon)).thenReturn(sampleSummaryDTO);

            Page<SalonSummaryDTO> result = salonService.getAllSalons(null, "Hair Styling", defaultPageable);

            assertThat(result.getContent()).hasSize(1);
            verify(salonRepository).findByServicesName(eq("Hair Styling"), any(Pageable.class));
        }

        @Test
        @DisplayName("both filters → calls findByDistrictAndServicesName")
        void bothFilters_callsFindByDistrictAndServicesName() {
            Page<Salon> salonPage = new PageImpl<>(List.of(sampleSalon));
            when(salonRepository.findByDistrictAndServicesName(
                    eq("Śródmieście"), eq("Hair Styling"), any(Pageable.class)))
                    .thenReturn(salonPage);
            when(salonMapper.toSummaryDTO(sampleSalon)).thenReturn(sampleSummaryDTO);

            Page<SalonSummaryDTO> result = salonService.getAllSalons("Śródmieście", "Hair Styling", defaultPageable);

            assertThat(result.getContent()).hasSize(1);
            verify(salonRepository).findByDistrictAndServicesName(
                    eq("Śródmieście"), eq("Hair Styling"), any(Pageable.class));
        }

        @Test
        @DisplayName("empty district string treated as no filter")
        void emptyDistrictString_treatedAsNoFilter() {
            Page<Salon> salonPage = new PageImpl<>(List.of(sampleSalon));
            when(salonRepository.findAll(any(Pageable.class))).thenReturn(salonPage);
            when(salonMapper.toSummaryDTO(sampleSalon)).thenReturn(sampleSummaryDTO);

            salonService.getAllSalons("", null, defaultPageable);

            verify(salonRepository).findAll(any(Pageable.class));
        }

        @Test
        @DisplayName("empty service string treated as no filter")
        void emptyServiceString_treatedAsNoFilter() {
            Page<Salon> salonPage = new PageImpl<>(List.of(sampleSalon));
            when(salonRepository.findAll(any(Pageable.class))).thenReturn(salonPage);
            when(salonMapper.toSummaryDTO(sampleSalon)).thenReturn(sampleSummaryDTO);

            salonService.getAllSalons(null, "", defaultPageable);

            verify(salonRepository).findAll(any(Pageable.class));
        }

        @Test
        @DisplayName("empty result → returns empty page")
        void emptyResult_returnsEmptyPage() {
            Page<Salon> emptyPage = new PageImpl<>(List.of());
            when(salonRepository.findAll(any(Pageable.class))).thenReturn(emptyPage);

            Page<SalonSummaryDTO> result = salonService.getAllSalons(null, null, defaultPageable);

            assertThat(result.getContent()).isEmpty();
            assertThat(result.getTotalElements()).isZero();
        }
    }

    // ─── GET SALON BY ID ───────────────────────────────────────────────

    @Nested
    @DisplayName("getSalonById")
    class GetSalonById {

        @Test
        @DisplayName("existing salon → returns detail DTO")
        void existingSalon_returnsDetailDTO() {
            when(salonRepository.findById(1L)).thenReturn(Optional.of(sampleSalon));
            when(salonMapper.toDetailDTO(sampleSalon)).thenReturn(sampleDetailDTO);

            SalonDetailDTO result = salonService.getSalonById(1L);

            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getName()).isEqualTo("Beauty Studio");
            assertThat(result.getAddress()).isEqualTo("Marszałkowska 1");
            verify(salonRepository).findById(1L);
        }

        @Test
        @DisplayName("non-existent salon → throws SalonNotFoundException")
        void nonExistentSalon_throwsException() {
            when(salonRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> salonService.getSalonById(999L))
                    .isInstanceOf(SalonNotFoundException.class);
        }
    }

    // ─── UPDATE SALON ──────────────────────────────────────────────────

    @Nested
    @DisplayName("updateSalon")
    class UpdateSalon {

        private SalonUpdateDTO updateDTO;

        @BeforeEach
        void setUpUpdate() {
            updateDTO = new SalonUpdateDTO();
            updateDTO.setName("Updated Beauty Studio");
            updateDTO.setAddress("Nowa 5");
            updateDTO.setDistrict("Mokotów");
            updateDTO.setPhone("+48 222 333 444");
            updateDTO.setWebsite("https://updated.pl");
            updateDTO.setPriceRange("zł zł zł");
            updateDTO.setRating(new BigDecimal("4.5"));
            updateDTO.setReviewCount(200);
        }

        @Test
        @DisplayName("existing salon → updates and returns detail DTO")
        void existingSalon_updatesAndReturnsDTO() {
            when(salonRepository.findById(1L)).thenReturn(Optional.of(sampleSalon));
            when(salonRepository.save(any(Salon.class))).thenReturn(sampleSalon);
            when(salonMapper.toDetailDTO(sampleSalon)).thenReturn(sampleDetailDTO);

            SalonDetailDTO result = salonService.updateSalon(1L, updateDTO);

            assertThat(result).isNotNull();
            verify(salonMapper).updateSalonFromDTO(updateDTO, sampleSalon);
            verify(salonRepository).save(sampleSalon);
        }

        @Test
        @DisplayName("non-existent salon → throws SalonNotFoundException")
        void nonExistentSalon_throwsException() {
            when(salonRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> salonService.updateSalon(999L, updateDTO))
                    .isInstanceOf(SalonNotFoundException.class);
        }

        @Test
        @DisplayName("update calls mapper then save")
        void updateCallsMapperThenSave() {
            when(salonRepository.findById(1L)).thenReturn(Optional.of(sampleSalon));
            when(salonRepository.save(any(Salon.class))).thenReturn(sampleSalon);
            when(salonMapper.toDetailDTO(sampleSalon)).thenReturn(sampleDetailDTO);

            salonService.updateSalon(1L, updateDTO);

            // Verify order: mapper first, then save
            var inOrder = inOrder(salonMapper, salonRepository);
            inOrder.verify(salonMapper).updateSalonFromDTO(updateDTO, sampleSalon);
            inOrder.verify(salonRepository).save(sampleSalon);
        }
    }
}
