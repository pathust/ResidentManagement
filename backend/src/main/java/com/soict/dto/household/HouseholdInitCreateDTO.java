package com.soict.dto.household;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdInitCreateDTO {

    @NotBlank
    private String code;

    @NotNull
    private Integer wardId;

    @Size(max = 255)
    private String houseAddressDetails;

    private LocalDate startDate;

    @NotEmpty
    private List<HouseholdInitMemberCreateDTO> members;
    private String note;
}
