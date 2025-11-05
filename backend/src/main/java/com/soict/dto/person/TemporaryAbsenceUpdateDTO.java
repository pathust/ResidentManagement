package com.soict.dto.person;

import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemporaryAbsenceUpdateDTO {

    private LocalDate endDate;

    @Size(max = 255)
    private String destination;

    @Size(max = 255)
    private String reason;

    @Size(max = 255)
    private String permAddressDetails;

    @Size(max = 255)
    private String tempAddressDetails;
    private Integer tempAddressWardId;
}
