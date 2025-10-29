package com.soict.dto.household;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdMembershipUpdateDTO {
    private Boolean isHouseholdHead;

    @Size(max = 45)
    private String relationToHead;

    private LocalDate endDate;
}
