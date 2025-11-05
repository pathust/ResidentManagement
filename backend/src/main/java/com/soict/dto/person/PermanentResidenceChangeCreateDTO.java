package com.soict.dto.person;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermanentResidenceChangeCreateDTO {

    @NotNull(message = "Person ID is required")
    private Integer personId;

    private Integer currentHouseholdId;

    private Integer prevAddressWardId;

    @Size(max = 255)
    private String prevAddressDetails;

    @NotNull(message = "Address ward is required")
    private Integer addressWardId;

    @Size(max = 255)
    private String addressDetails;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private String details;
}
