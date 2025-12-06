package com.soict.dto.fund;

import jakarta.validation.constraints.NotBlank;
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
public class FundCreateDTO {
    @NotBlank(message = "Name is required")
    @Size(max = 255)
    private String name;

    private String description;

    @NotBlank(message = "Type is required")
    @Size(max = 50)
    private String type; // RESTRICTED, UNRESTRICTED

    @Size(max = 10)
    private String currency;

    @Size(max = 255)
    private String restrictedTo;

    private BigDecimal balance;
}
