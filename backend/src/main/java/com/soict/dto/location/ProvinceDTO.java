package com.soict.dto.location;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProvinceDTO {
    private Integer id;

    @NotBlank(message = "Province name is required")
    @Size(max = 255)
    private String name;

    private Set<WardDTO> wards;
}