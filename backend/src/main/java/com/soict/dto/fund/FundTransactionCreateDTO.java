package com.soict.dto.fund;

import jakarta.validation.constraints.NotBlank;
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
public class FundTransactionCreateDTO {
    @NotNull(message = "Fund ID is required")
    private Integer fundId;

    @NotBlank(message = "Transaction Type is required")
    @Size(max = 50)
    private String transactionType; // INFLOW, OUTFLOW

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private LocalDate transactionDate;

    private Integer referenceId;

    @Size(max = 50)
    private String referenceType;

    private Integer userId;

    private String notes;
}
