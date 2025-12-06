package com.soict.dto.fund;

import jakarta.validation.constraints.NotNull;
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
public class FundTransferCreateDTO {
    @NotNull(message = "Source Fund ID is required")
    private Integer sourceFundId;

    @NotNull(message = "Destination Fund ID is required")
    private Integer destFundId;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private LocalDate transferDate;

    private String reason;

    private Integer userId;
}
