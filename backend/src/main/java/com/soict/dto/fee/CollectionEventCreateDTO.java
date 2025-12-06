package com.soict.dto.fee;

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
public class CollectionEventCreateDTO {
    @NotNull(message = "Fee Type ID is required")
    private Integer feeTypeId;

    @NotNull(message = "Event Date is required")
    private LocalDate eventDate;

    private LocalDate dueDate;

    private String description;

    @NotNull(message = "Collector User ID is required")
    private Integer collectorUserId;

    private Integer approverUserId;

    private BigDecimal totalExpected;

    @Size(max = 50)
    private String status; // OPEN, CLOSED, CANCELLED

    private Integer fundId;
}
