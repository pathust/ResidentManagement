package com.soict.dto.fee;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FeeTypeDTO {
    private Integer id;
    private String name;
    private String description;
    private String unit;
    private BigDecimal defaultAmount;
    private String frequency; // ONE_TIME, MONTHLY, YEARLY
    private Boolean isMandatory;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}