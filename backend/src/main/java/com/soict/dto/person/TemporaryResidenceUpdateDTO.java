package com.soict.dto.person;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemporaryResidenceUpdateDTO {

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @Size(max = 255)
    private String details;
}
