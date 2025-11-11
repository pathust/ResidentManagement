package com.soict.dto.household;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdSplitDTO {
    private Integer id;

    private Integer fromHouseholdId;
    private Integer toHouseholdId;

    private LocalDate splitDate;

    private String note;

    private LocalDateTime createdAt;

    private List<HouseholdSplitMemberDTO> members;
}
