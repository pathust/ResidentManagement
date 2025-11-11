package com.soict.dto.household;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdSplitMemberUpdateDTO {
    private Integer personId;
    private Boolean isHead;
}
