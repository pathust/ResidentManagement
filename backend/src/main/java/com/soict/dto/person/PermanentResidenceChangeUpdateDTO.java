package com.soict.dto.person;

import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermanentResidenceChangeUpdateDTO {
    private Integer currentHouseholdId;
    private Integer prevAddressWardId;

    @Size(max = 255)
    private String prevAddressDetails;
    private Integer addressWardId;

    @Size(max = 255)
    private String addressDetails;

    private LocalDate startDate;
    private String details;
}
