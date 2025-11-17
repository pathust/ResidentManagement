package com.soict.dto.household;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdHeadChangeUpdateDTO {

    private Integer fromPersonId;
    private Integer toPersonId;

    private LocalDate changeDate;
}
