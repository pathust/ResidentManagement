package com.soict.dto.household;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

// Household Member DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdMemberDTO {
    private Integer membershipId;
    private Integer personId;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String idNumber;
    private String phoneNumber;
    private Boolean isHouseholdHead;
    private String relationToHead;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
}
