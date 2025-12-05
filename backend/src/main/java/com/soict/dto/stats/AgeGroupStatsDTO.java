package com.soict.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgeGroupStatsDTO {
    // 0 <= age < 18
    private long age0To17;
    // 18 <= age <= 60
    private long age18To60;
    // age > 60
    private long ageOver60;
}
