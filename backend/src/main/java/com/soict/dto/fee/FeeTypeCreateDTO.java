package com.soict.dto.fee;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeTypeCreateDTO {
    @NotBlank(message = "Name is required")
    @Size(max = 255)
    private String name;

    private String description;

    @NotBlank(message = "Unit is required")
    @Size(max = 50)
    private String unit;

    private BigDecimal defaultAmount;

    @Size(max = 50)
    private String frequency; // ONE_TIME, MONTHLY, YEARLY

    @NotNull
    private Boolean isMandatory;
}
