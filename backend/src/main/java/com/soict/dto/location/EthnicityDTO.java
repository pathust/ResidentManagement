package com.soict.dto.location;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EthnicityDTO {
    private Integer id;

    @NotBlank(message = "Ethnicity name is required")
    @Size(max = 255)
    private String name;
}