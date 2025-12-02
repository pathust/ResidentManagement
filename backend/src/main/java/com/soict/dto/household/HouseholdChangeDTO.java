package com.soict.dto.household;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdChangeDTO {

    private Integer fromHouseholdId;
    private Integer toHouseholdId;
    private Integer personId;

    private LocalDate changeDate;

    private String relationWithHead;
    private String note;
}
