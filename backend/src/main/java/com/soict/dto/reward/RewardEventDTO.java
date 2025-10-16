package com.soict.dto.reward;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RewardEventDTO {
    private Integer id;
    private String name;
    private LocalDate eventDate;
    private Integer fundId;
    private String fundName;
    private Integer approverUserId;
    private String approverUsername;
    private String status; // PENDING, APPROVED, COMPLETED, CANCELLED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}