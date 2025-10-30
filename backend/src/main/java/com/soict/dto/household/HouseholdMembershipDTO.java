package com.soict.dto.household;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdMembershipDTO {
    private Integer id;
    private Integer householdId;
    private String householdCode;
    private Integer personId;
    private String personName;
    private Boolean isHouseholdHead;
    private String relationToHead;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate registrationPermDate;
    private Integer prevPermAddressWardId;
    private String prevPermAddressWardName;
    private String prevPermAddressDetails;
}