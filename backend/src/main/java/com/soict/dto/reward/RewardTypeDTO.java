package com.soict.dto.reward;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RewardTypeDTO {
    private Integer id;
    private String name;
    private String description;
    private BigDecimal defaultAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}