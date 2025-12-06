package com.soict.dto.fund;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FundUpdateDTO {
    @Size(max = 255)
    private String name;

    private String description;

    @Size(max = 50)
    private String type; // RESTRICTED, UNRESTRICTED

    @Size(max = 255)
    private String restrictedTo;
}
