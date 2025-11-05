package com.soict.dto.person;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemporaryAbsenceCreateDTO {

    @NotNull(message = "Person ID is required")
    private Integer personId;

    private Integer currentHouseholdId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    private LocalDate endDate;

    @Size(max = 255, message = "Destination max length is 255")
    private String destination;

    @Size(max = 255, message = "Reason max length is 255")
    private String reason;

    private Integer permAddressWardId;
    private Integer tempAddressWardId;

    @Size(max = 255, message = "Perm address details max length is 255")
    private String permAddressDetails;

    @Size(max = 255, message = "Temp address details max length is 255")
    private String tempAddressDetails;
}
