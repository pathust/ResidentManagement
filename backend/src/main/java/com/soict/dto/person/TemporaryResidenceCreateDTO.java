// TemporaryResidenceCreateDTO.java
package com.soict.dto.person;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemporaryResidenceCreateDTO {

    @NotNull(message = "Person ID is required")
    private Integer personId;

    private Integer currentHouseholdId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull(message = "Temporary address ward is required")
    private Integer tempAddressWardId;

    @Size(max = 255, message = "Temporary address details must be <= 255 characters")
    private String tempAddressDetails;

    private String details;
}
