package com.soict.entity.household.event;

import com.soict.entity.household.Household;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "household_event")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @Column(name = "event_type", nullable = false, length = 45)
    private String eventType;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String details;
}
