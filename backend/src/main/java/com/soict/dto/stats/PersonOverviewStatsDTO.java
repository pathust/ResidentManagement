package com.soict.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonOverviewStatsDTO {

    private long totalPersons;
    private long alivePersons;

    private GenderStatsDTO genderStats;

    private AgeGroupStatsDTO ageGroupStats;
}
