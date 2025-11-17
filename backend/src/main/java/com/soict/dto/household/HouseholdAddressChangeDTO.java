package com.soict.dto.household;

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

public class HouseholdAddressChangeDTO {

    private Integer id;

    @NotNull
    private Integer householdId;

    private Integer fromAddressWardId;

    @Size(max = 255)
    private String fromAddressDetails;

    @NotNull
    private Integer toAddressWardId;

    @Size(max = 255)
    private String toAddressDetails;

    private LocalDate changeDate;

    private LocalDateTime createdAt;
}
