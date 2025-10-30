package com.soict.dto.household;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdMembershipCreateDTO {
    @NotNull
    private Integer personId;

    @NotNull
    private Boolean isHouseholdHead;

    @NotBlank
    @Size(max = 45)
    private String relationToHead;

    @NotNull
    private LocalDate startDate;

    private LocalDate registrationPermDate;
    private Integer prevPermAddressWardId;

    @Size(max = 255)
    private String prevPermAddressDetails;
}
