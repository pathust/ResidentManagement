package com.soict.dto.fund;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FundDTO {
    private Integer id;
    private String name;
    private String description;
    private String type; // RESTRICTED, UNRESTRICTED
    private String currency;
    private String restrictedTo;
    private BigDecimal balance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}