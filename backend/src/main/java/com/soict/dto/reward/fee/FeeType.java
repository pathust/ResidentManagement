package com.soict.dto.reward.fee;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fee_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FeeType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String unit;

    @Column(name = "default_amount", precision = 15, scale = 2)
    private BigDecimal defaultAmount = BigDecimal.ZERO;

    @Column(length = 50)
    private String frequency = "ONE_TIME";

    @Column(name = "is_mandatory")
    private Boolean isMandatory = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
