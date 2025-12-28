package com.soict.dto.fund;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseUpdateDTO {
    private LocalDate expenseDate;
    private BigDecimal amount;
    private String description;

    @Size(max = 255)
    private String recipient;

    @Size(max = 255)
    private String proof;

    @Size(max = 50)
    private String status; // PENDING, APPROVED, REJECTED

    private String notes;
}
