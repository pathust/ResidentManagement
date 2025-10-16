package com.soict.dto.fee;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CollectionEventDTO {
    private Integer id;
    private Integer feeTypeId;
    private String feeTypeName;
    private LocalDate eventDate;
    private LocalDate dueDate;
    private String description;
    private Integer collectorUserId;
    private String collectorUsername;
    private Integer approverUserId;
    private String approverUsername;
    private BigDecimal totalExpected;
    private String status; // OPEN, CLOSED, CANCELLED
    private Integer fundId;
    private String fundName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}