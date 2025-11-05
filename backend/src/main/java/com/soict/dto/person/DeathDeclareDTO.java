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

public class DeathDeclareDTO {
    private Integer id;
    // @NotBlank(message = "Person ID is required")
    private Integer personId;
    private String idNumber;

    @NotNull(message = "Declarer ID is required")
    private Integer declarerId;

    @NotNull(message = "Date of declaration is required")
    private LocalDate dateOfDeclaration;

    private LocalDateTime timeOfDeath;

    @NotNull(message = "Last permanent residence ward is required")
    private Integer lastPermanentResidenceWardId;

    @Size(max = 255)
    private String lastPermanentResidenceDetails;
    private String note;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}