package com.sumup.moumni.salonapi.Controller;

import com.sumup.moumni.salonapi.Common.Exception.SalonNotFoundException;
import com.sumup.moumni.salonapi.Dto.PageableDTO;
import com.sumup.moumni.salonapi.Dto.SalonDetailDTO;
import com.sumup.moumni.salonapi.Dto.SalonFilterDTO;
import com.sumup.moumni.salonapi.Dto.SalonSummaryDTO;
import com.sumup.moumni.salonapi.Dto.SalonUpdateDTO;
import com.sumup.moumni.salonapi.Entity.Salon;
import com.sumup.moumni.salonapi.Service.SalonService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SalonControllerTest {

    @Mock
    private SalonService salonService;

    @InjectMocks
    private SalonController salonController;

    private Salon sampleSalon;
    private SalonSummaryDTO sampleSummaryDTO;
    private SalonDetailDTO sampleDetailDTO;
    private PageableDTO defaultPageable;

    @BeforeEach
    void setUp() {
        sampleSalon = new Salon();
        sampleSalon.setId(1L);
        sampleSalon.setName("Beauty Studio");
        sampleSalon.setAddress("ul. Marszałkowska 1");
        sampleSalon.setDistrict("Śródmieście");
        sampleSalon.setPriceRange("zł zł");
        sampleSalon.setRating(new BigDecimal("4.5"));
        sampleSalon.setReviewCount(150);

        sampleSummaryDTO = new SalonSummaryDTO();
        sampleSummaryDTO.setId(1L);
        sampleSummaryDTO.setName("Beauty Studio");
        sampleSummaryDTO.setDistrict("Śródmieście");
        sampleSummaryDTO.setPriceRange("zł zł");
        sampleSummaryDTO.setRating(new BigDecimal("4.5"));
        sampleSummaryDTO.setReviewCount(150);

        sampleDetailDTO = new SalonDetailDTO();
        sampleDetailDTO.setId(1L);
        sampleDetailDTO.setName("Beauty Studio");
        sampleDetailDTO.setAddress("ul. Marszałkowska 1");
        sampleDetailDTO.setDistrict("Śródmieście");
        sampleDetailDTO.setPriceRange("zł zł");
        sampleDetailDTO.setRating(new BigDecimal("4.5"));
        sampleDetailDTO.setReviewCount(150);

        defaultPageable = new PageableDTO();
        defaultPageable.setPage(0);
        defaultPageable.setSize(20);
        defaultPageable.setSort("rating");
        defaultPageable.setOrderBy("DESC");
    }

    @Test
    @DisplayName("getAllSalons - should return paginated list of salons")
    void getAllSalons_ShouldReturnPaginatedSalons() {
        // Arrange
        SalonFilterDTO filterDTO = new SalonFilterDTO();
        Page<SalonSummaryDTO> salonPage = new PageImpl<>(List.of(sampleSummaryDTO));
        when(salonService.getAllSalons(any(), any(), any())).thenReturn(salonPage);

        // Act
        Page<SalonSummaryDTO> result = salonController.getAllSalons(filterDTO, defaultPageable);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("Beauty Studio");
        assertThat(result.getTotalElements()).isEqualTo(1);
    }

    @Test
    @DisplayName("getAllSalons - should filter by district")
    void getAllSalons_ShouldFilterByDistrict() {
        // Arrange
        SalonFilterDTO filterDTO = new SalonFilterDTO();
        filterDTO.setDistrict("Śródmieście");
        Page<SalonSummaryDTO> salonPage = new PageImpl<>(List.of(sampleSummaryDTO));
        when(salonService.getAllSalons(eq("Śródmieście"), isNull(), any())).thenReturn(salonPage);

        // Act
        Page<SalonSummaryDTO> result = salonController.getAllSalons(filterDTO, defaultPageable);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getDistrict()).isEqualTo("Śródmieście");
    }

    @Test
    @DisplayName("getAllSalons - should filter by service")
    void getAllSalons_ShouldFilterByService() {
        // Arrange
        SalonFilterDTO filterDTO = new SalonFilterDTO();
        filterDTO.setService("Hair Styling");
        Page<SalonSummaryDTO> salonPage = new PageImpl<>(List.of(sampleSummaryDTO));
        when(salonService.getAllSalons(isNull(), eq("Hair Styling"), any())).thenReturn(salonPage);

        // Act
        Page<SalonSummaryDTO> result = salonController.getAllSalons(filterDTO, defaultPageable);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    @DisplayName("getSalonById - should return salon detail")
    void getSalonById_ShouldReturnSalonDetail() {
        // Arrange
        when(salonService.getSalonById(1L)).thenReturn(sampleDetailDTO);

        // Act
        SalonDetailDTO result = salonController.getSalonById(1L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Beauty Studio");
        assertThat(result.getAddress()).isEqualTo("ul. Marszałkowska 1");
    }

    @Test
    @DisplayName("getSalonById - should throw exception when salon not found")
    void getSalonById_ShouldThrowExceptionWhenNotFound() {
        // Arrange
        when(salonService.getSalonById(999L)).thenThrow(new SalonNotFoundException());

        // Act & Assert
        assertThatThrownBy(() -> salonController.getSalonById(999L))
                .isInstanceOf(SalonNotFoundException.class);
    }

    @Test
    @DisplayName("updateSalon - should update and return salon")
    void updateSalon_ShouldUpdateAndReturnSalon() {
        // Arrange
        SalonUpdateDTO updateDTO = new SalonUpdateDTO();
        updateDTO.setName("Updated Beauty Studio");
        updateDTO.setAddress("ul. Nowa 2");
        updateDTO.setDistrict("Mokotów");
        updateDTO.setPhone("+48 123 456 789");
        updateDTO.setWebsite("https://updated.pl");
        updateDTO.setPriceRange("zł zł zł");
        updateDTO.setRating(new BigDecimal("4.8"));
        updateDTO.setReviewCount(200);

        sampleDetailDTO.setName("Updated Beauty Studio");
        sampleDetailDTO.setAddress("ul. Nowa 2");
        sampleDetailDTO.setDistrict("Mokotów");
        sampleDetailDTO.setPriceRange("zł zł zł");
        sampleDetailDTO.setRating(new BigDecimal("4.8"));
        sampleDetailDTO.setReviewCount(200);

        when(salonService.updateSalon(eq(1L), any(SalonUpdateDTO.class))).thenReturn(sampleDetailDTO);

        // Act
        SalonDetailDTO result = salonController.updateSalon(1L, updateDTO);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Updated Beauty Studio");
        assertThat(result.getAddress()).isEqualTo("ul. Nowa 2");
        assertThat(result.getDistrict()).isEqualTo("Mokotów");
        assertThat(result.getPriceRange()).isEqualTo("zł zł zł");
    }

    @Test
    @DisplayName("updateSalon - should throw exception when salon not found")
    void updateSalon_ShouldThrowExceptionWhenNotFound() {
        // Arrange
        SalonUpdateDTO updateDTO = new SalonUpdateDTO();
        updateDTO.setName("Updated Beauty Studio");
        when(salonService.updateSalon(eq(999L), any(SalonUpdateDTO.class)))
                .thenThrow(new SalonNotFoundException());

        // Act & Assert
        assertThatThrownBy(() -> salonController.updateSalon(999L, updateDTO))
                .isInstanceOf(SalonNotFoundException.class);
    }
}
