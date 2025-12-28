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
public class TemporaryAbsenceDTO {

    private Integer id;

    @NotNull(message = "Person ID is required")
    private Integer personId;

    private Integer currentHouseholdId;

    private Integer permAddressWardId;
    private Integer tempAddressWardId;

    private String personName;
    private String personIdNumber;
    private String householdCode;
    private String permAddressWardName;
    private String tempAddressWardName;

    private LocalDate startDate;
    private LocalDate endDate;

    @Size(max = 255, message = "Destination max length is 255")
    private String destination;

    @Size(max = 255, message = "Reason max length is 255")
    private String reason;

    @Size(max = 255, message = "Perm address details max length is 255")
    private String permAddressDetails;

    @Size(max = 255, message = "Temp address details max length is 255")
    private String tempAddressDetails;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
