package com.soict.entity.reward;

import com.soict.entity.person.Person;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "person_rewards",
        indexes = {
                @Index(name = "idx_pr_person_id", columnList = "person_id"),
                @Index(name = "idx_pr_reward_type_id", columnList = "reward_type_id")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_person_reward_event",
                        columnNames = {"reward_event_id", "person_id", "reward_type_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PersonReward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reward_event_id", nullable = false)
    private RewardEvent rewardEvent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reward_type_id", nullable = false)
    private RewardType rewardType;

    @Column(name = "awarded_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal awardedAmount;

    @Column(name = "gift_description", columnDefinition = "TEXT")
    private String giftDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PersonRewardStatus status = PersonRewardStatus.PENDING;

    @Column(name = "payout_date")
    private LocalDate payoutDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum PersonRewardStatus {
        PENDING, APPROVED, PAID, CANCELLED
    }
}