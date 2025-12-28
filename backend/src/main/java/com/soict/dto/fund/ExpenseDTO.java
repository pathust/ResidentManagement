package com.soict.dto.fund;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDTO {
    private Integer id;
    private Integer fundId;
    private String fundName;
    private LocalDate expenseDate;
    private BigDecimal amount;
    private String description;
    private Integer approverUserId;
    private String approverUsername;
    private String recipient;
    private String proof;
    private String status; // PENDING, APPROVED, REJECTED
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
