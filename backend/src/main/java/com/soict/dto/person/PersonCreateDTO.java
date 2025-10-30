package com.soict.dto.person;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonCreateDTO {

    @NotBlank(message = "Full name is required")
    @Size(max = 255)
    private String fullName;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @Size(max = 255)
    private String placeOfBirth;

    @NotNull(message = "Place of origin ward is required")
    private Integer placeOfOriginWardId;

    @Size(max = 255)
    private String placeOfOriginDetails;

    @NotNull(message = "Ethnicity is required")
    private Integer ethnicityId;

    @Size(max = 100)
    private String religion;

    @NotNull(message = "Gender is required")
    private String gender; // M, F, X

    @Size(max = 255)
    private String occupation;

    @Size(max = 255)
    private String workplace;

    @Size(max = 50)
    private String idNumber;

    private LocalDate idIssueDate;

    @Size(max = 255)
    private String idIssuePlace;

    private Integer currentHouseholdId;

    @NotNull(message = "Permanent address ward is required")
    private Integer permAddressWardId;

    @Size(max = 255)
    private String permAddressDetails;

    private Integer tempAddressWardId;

    @Size(max = 255)
    private String tempAddressDetails;

    @Pattern(regexp = "^[0-9]{10,15}$", message = "Invalid phone number")
    private String phoneNumber;

    @Email(message = "Invalid email address")
    @Size(max = 255)
    private String emailAddress;

    @NotNull
    private String status; // ALIVE, DEAD

    private String notes;
}