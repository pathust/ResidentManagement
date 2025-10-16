package com.soict.dto.fund;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FundTransferDTO {
    private Integer id;
    private Integer sourceFundId;
    private String sourceFundName;
    private Integer destFundId;
    private String destFundName;
    private BigDecimal amount;
    private LocalDate transferDate;
    private String reason;
    private Integer userId;
    private String username;
    private String status; // PENDING, COMPLETED, CANCELLED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}