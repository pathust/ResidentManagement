package com.soict.dto.household;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdHeadChangeDTO {
    private Integer id;

    @NotNull
    private Integer householdId;

    private Integer fromPersonId;

    @NotNull
    private Integer toPersonId;

    private LocalDate changeDate;

    private LocalDateTime createdAt;
}
