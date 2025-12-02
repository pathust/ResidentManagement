package com.soict.dto.household;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdInitMemberCreateDTO {

    @NotNull
    private Integer personId;

    private Boolean isHead;

    @Size(max = 100)
    private String relationWithHead;

    private LocalDate startDate;
}
