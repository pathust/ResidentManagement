package com.soict.dto.person;

import com.soict.entity.person.Person;
import jakarta.validation.constraints.NotBlank;
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

public class BirthDeclareDTO {

    private Integer id;
    private Integer personId;

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
    @NotBlank(message = "Relation with declarer is required")
    private String relationWithDeclarer;
    private String note;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}