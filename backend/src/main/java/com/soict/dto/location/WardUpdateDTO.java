package com.soict.dto.location;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WardUpdateDTO {
    @NotBlank(message = "Province name is required")
    @Size(max = 255)
    private String name;

    @NotNull(message = "Ward must belong to a province")
    private Integer provinceId;
}