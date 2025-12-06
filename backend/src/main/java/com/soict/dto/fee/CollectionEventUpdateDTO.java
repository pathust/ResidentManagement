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
public class CollectionEventUpdateDTO {
    private LocalDate eventDate;
    private LocalDate dueDate;
    private String description;
    private Integer approverUserId;
    private BigDecimal totalExpected;

    @Size(max = 50)
    private String status; // OPEN, CLOSED, CANCELLED

    private Integer fundId;
}
