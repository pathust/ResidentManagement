package com.soict.dto.household;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdSplitMemberCreateDTO {
    @NotNull
    private Integer personId;

    @Builder.Default
    private Boolean isHead = false;
}
