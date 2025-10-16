package com.soict.dto.fee;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentLogDTO {
    private Integer id;
    private Integer paymentId;
    private String changeType; // CREATE, UPDATE, DELETE
    private LocalDateTime changeDate;
    private BigDecimal amount;
    private String details;
    private Integer userId;
    private String username;
}