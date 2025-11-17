package com.soict.dto.household;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdSplitUpdateDTO {

    private LocalDate splitDate;

    private String note;

    private Integer toHouseholdId;

    // private String newHouseholdCode;
}
