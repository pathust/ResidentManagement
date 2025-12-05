package com.soict.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WardHouseholdStatsDTO {

    private Integer wardId;

    private long totalHousehold;

}
