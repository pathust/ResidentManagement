package com.soict.dto.person;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonDTO {
    private Integer id;

    @NotBlank(message = "Full name is required")
    @Size(max = 255)
    private String fullName;

    private LocalDate dateOfBirth;

    @Size(max = 255)
    private String placeOfBirth;

    private Integer placeOfOriginWardId;
    private String placeOfOriginWardName;
    private String placeOfOriginProvinceName;

    @Size(max = 255)
    private String placeOfOriginDetails;

    private Integer ethnicityId;
    private String ethnicityName;

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
    private String currentHouseholdCode;

    private Integer permAddressWardId;
    private String permAddressWardName;
    private String permAddressProvinceName;

    @Size(max = 255)
    private String permAddressDetails;

    private Integer tempAddressWardId;
    private String tempAddressWardName;
    private String tempAddressProvinceName;
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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}