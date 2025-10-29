package com.soict.dto.household;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdUpdateDTO {
    private Integer wardId;

    @Size(max = 255)
    private String houseAddressDetails;

    private String notes;
}
