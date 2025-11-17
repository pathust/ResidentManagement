package com.soict.dto.household;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdHeadChangeCreateDTO {

    @NotNull
    private Integer householdId;

    private Integer fromPersonId;

    @NotNull
    private Integer toPersonId;

    @NotNull
    private LocalDate changeDate;
}
