package com.soict.dto.person;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemporaryResidenceDTO {

    private Integer id;

    @NotNull(message = "Person ID is required")
    private Integer personId;
    private String personName;
    private String personIdNumber;

    private Integer currentHouseholdId;
    private String currentHouseholdCode;

    private LocalDate startDate;
    private LocalDate endDate;

    @NotNull(message = "Temporary address ward is required")
    private Integer tempAddressWardId;
    private String tempAddressWardName;
    @Size(max = 255, message = "Temporary address details must be <= 255 characters")
    private String tempAddressDetails;

    private String details;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
