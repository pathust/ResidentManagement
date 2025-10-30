package com.soict.dto.household;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdCreateDTO {
    @NotNull
    private Integer wardId;

    @Size(max = 255)
    private String houseAddressDetails;

    @NotBlank
    @Size(max = 50)
    private String code;

    private String notes;
}
