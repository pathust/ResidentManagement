package com.soict.entity.household.event;

import com.soict.entity.household.Household;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "household_head_change")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdHeadChange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_person_id", nullable = false)
    private com.soict.entity.person.Person fromPerson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_person_id", nullable = false)
    private com.soict.entity.person.Person toPerson;

    @Column(name = "change_date", nullable = false)
    private LocalDate changeDate;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}