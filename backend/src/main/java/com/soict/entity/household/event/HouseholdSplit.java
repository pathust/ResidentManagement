package com.soict.entity.household.event;

import com.soict.entity.household.Household;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "household_split")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdSplit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "from_household_id", nullable = false)
    private Household fromHousehold;

    @ManyToOne
    @JoinColumn(name = "to_household_id", nullable = false)
    private Household toHousehold;

    @Column(name = "split_date", nullable = false)
    private LocalDate splitDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String note;

    @OneToMany(mappedBy = "householdSplit")
    private Set<HouseholdSplitMember> members;
}