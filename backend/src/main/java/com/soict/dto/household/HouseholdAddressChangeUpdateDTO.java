package com.soict.dto.household;

import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdAddressChangeUpdateDTO {

    private Integer fromAddressWardId;

    @Size(max = 255)
    private String fromAddressDetails;

    private Integer toAddressWardId;

    @Size(max = 255)
    private String toAddressDetails;

    private LocalDate changeDate;
}
