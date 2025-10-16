package com.soict.dto.person;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PersonDTO {
    private Integer id;
    private Integer currentHouseholdId;
    private String fullName;
    private LocalDate dateOfBirth;
    private String placeOfBirth;
    private Integer placeOfOriginWardId;
    private String placeOfOriginWardName;
    private String placeOfOriginDetails;
    private Integer ethnicityId;
    private String ethnicityName;
    private String religion;
    private String gender; // M, F, X
    private String occupation;
    private String workplace;
    private String idNumber;
    private LocalDate idIssueDate;
    private String idIssuePlace;
    private Integer permAddressWardId;
    private String permAddressWardName;
    private Integer tempAddressWardId;
    private String tempAddressWardName;
    private String permAddressDetails;
    private String tempAddressDetails;
    private String phoneNumber;
    private String emailAddress;
    private String status; // ALIVE, DEAD
    private String notes;

    // Household membership info
    private String relationToHead;
    private Boolean isHouseholdHead;
    private LocalDate membershipStartDate;
    private LocalDate membershipEndDate;
}