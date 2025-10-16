package com.soict.dto.reward;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PersonRewardDTO {
    private Integer id;
    private Integer rewardEventId;
    private String rewardEventName;
    private Integer personId;
    private String personName;
    private Integer rewardTypeId;
    private String rewardTypeName;
    private BigDecimal awardedAmount;
    private String giftDescription;
    private String status; // PENDING, APPROVED, PAID, CANCELLED
    private LocalDate payoutDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}