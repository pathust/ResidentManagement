package com.soict.dto.household;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdSplitCreateDTO {

    @NotNull
    private Integer fromHouseholdId;
    private Integer toHouseholdId;
    private String newHouseholdCode;

    @NotNull
    private LocalDate splitDate;

    private String note;

    @NotNull
    private List<HouseholdSplitMemberCreateDTO> members;
}
