package com.soict.dto.fund;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FundTransactionDTO {
    private Integer id;
    private Integer fundId;
    private String fundName;
    private String transactionType; // INFLOW, OUTFLOW, TRANSFER_IN, TRANSFER_OUT
    private BigDecimal amount;
    private LocalDate transactionDate;
    private Integer referenceId;
    private String referenceType; // PAYMENT, EXPENSE, TRANSFER, REWARD
    private Integer userId;
    private String username;
    private String notes;
    private LocalDateTime createdAt;
}