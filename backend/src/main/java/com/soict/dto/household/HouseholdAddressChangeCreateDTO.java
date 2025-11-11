package com.soict.dto.household;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdAddressChangeCreateDTO {
    @NotNull
    private Integer householdId;

    private Integer fromAddressWardId;

    @Size(max = 255)
    private String fromAddressDetails;

    @NotNull
    private Integer toAddressWardId;

    @Size(max = 255)
    private String toAddressDetails;

    @NotNull
    private LocalDate changeDate;
}
