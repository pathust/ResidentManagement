package com.soict.dto.location;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EthnicityUpdateDTO {
    @NotBlank(message = "Ethnicity name is required")
    @Size(max = 255)
    private String name;
}