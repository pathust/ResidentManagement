package com.soict.entity.household.event;

import com.soict.entity.household.Household;
import com.soict.entity.person.Person;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "household_head_change")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdHeadChange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @ManyToOne
    @JoinColumn(name = "from_person_id", nullable = false)
    private Person fromPerson;

    @ManyToOne
    @JoinColumn(name = "to_person_id", nullable = false)
    private Person toPerson;

    @Column(name = "change_date", nullable = false)
    private LocalDate changeDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
