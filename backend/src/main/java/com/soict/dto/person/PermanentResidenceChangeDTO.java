package com.soict.dto.person;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermanentResidenceChangeDTO {

    private Integer id;

    @NotNull(message = "Person ID is required")
    private Integer personId;
    private String personName;
    private String personIdNumber;

    private Integer currentHouseholdId;
    private String currentHouseholdCode;

    private Integer prevAddressWardId;
    private String prevAddressWardName;
    private String prevAddressDetails;

    @NotNull(message = "Address ward is required")
    private Integer addressWardId;
    private String addressWardName;
    private String addressDetails;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private String details;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
