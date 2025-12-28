package com.soict.entity.household.event;

import com.soict.entity.household.Household;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "household_split")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdSplit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_household_id", nullable = false)
    private Household fromHousehold;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_household_id", nullable = false)
    private Household toHousehold;

    @Column(name = "split_date", nullable = false)
    private LocalDate splitDate;

    @Column(columnDefinition = "TEXT")
    private String note;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}