package com.soict.dto.fund;

import jakarta.validation.constraints.NotNull;
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
public class ExpenseCreateDTO {
    @NotNull(message = "Fund ID is required")
    private Integer fundId;

    private LocalDate expenseDate;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private String description;

    private Integer approverUserId;

    @Size(max = 255)
    private String recipient;

    @Size(max = 255)
    private String proof;

    @Size(max = 50)
    private String status; // PENDING, APPROVED, REJECTED

    private String notes;
}
