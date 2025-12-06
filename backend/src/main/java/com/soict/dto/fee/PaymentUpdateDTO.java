package com.soict.dto.fee;

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
public class PaymentUpdateDTO {
    private BigDecimal amountPaid;
    private LocalDate paymentDate;

    @Size(max = 100)
    private String method; // CASH, TRANSFER, CARD

    @Size(max = 50)
    private String status; // PENDING, PARTIAL, COMPLETED

    private String notes;
}
