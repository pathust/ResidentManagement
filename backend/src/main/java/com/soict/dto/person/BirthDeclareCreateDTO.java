package com.soict.dto.person;

import com.soict.entity.person.Person;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class BirthDeclareCreateDTO {

//    @NotBlank(message = "Full name is required")
//    private String fullName;

//    private Person.Gender childGender;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Place of birth is required")
    private String placeOfBirth;

    private Integer declarerId;
    private Integer fatherId;
    private Integer motherId;

    @NotNull(message = "Origin ward is required")
    private Integer placeOfOriginWardId;

    @Size(max = 255)
    private String placeOfOriginDetails;

    @NotNull(message = "Date of declaration is required")
    private LocalDate dateOfDeclaration;

    @Size(max = 45)
    @NotNull(message = "Relation with declarer is required")
    private String relationWithDeclarer;
    private String note;
}

