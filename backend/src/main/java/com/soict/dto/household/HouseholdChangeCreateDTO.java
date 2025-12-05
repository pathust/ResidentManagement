package com.soict.dto.household;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdChangeCreateDTO {
    @NotNull
    private Integer toHouseholdId;

    @NotNull
    private Integer personId;
    private LocalDate changeDate;

    @Size(max = 20)
    private String relationWithHead;

    @Size(max = 500)
    private String note;
}
