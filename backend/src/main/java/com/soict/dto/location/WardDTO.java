package com.soict.dto.location;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WardDTO {
    private Integer id;

    @NotBlank(message = "Ward name is required")
    @Size(max = 255)
    private String name;

    @NotNull(message = "Province ID is required")
    private Integer provinceId;

    private String provinceName;
}