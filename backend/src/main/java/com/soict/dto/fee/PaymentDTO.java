package com.soict.dto.fee;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Integer id;
    private Integer collectionEventId;
    private String collectionEventName;
    private Integer householdId;
    private String householdCode;
    private Integer personId;
    private String personName;
    private BigDecimal expectedAmount;
    private BigDecimal amountPaid;
    private LocalDate paymentDate;
    private String method; // CASH, TRANSFER, CARD
    private String status; // PENDING, PARTIAL, COMPLETED
    private String notes;
    private Integer fundId;
    private String fundName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}