package com.soict.dto.person;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class DeathDeclareCreateDTO {
    @NotNull(message = "Person ID is required")
    private Integer personId;
    private String idNumber;

    @NotNull(message = "Declarer ID is required")
    private Integer declarerId;

    private LocalDate dateOfDeclaration;

    private LocalDateTime timeOfDeath;

    private Integer lastPermanentResidenceWardId;

    @Size(max = 255)
    private String lastPermanentResidenceDetails;

    private String note;
}