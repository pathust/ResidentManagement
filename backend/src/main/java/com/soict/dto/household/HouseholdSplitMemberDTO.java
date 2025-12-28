package com.soict.dto.household;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdSplitMemberDTO {
    private Integer id;
    @NotNull
    private Integer personId;
    private Boolean isHead;
}
