package com.soict.entity.household.event;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "household_split_member")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdSplitMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_split_id", nullable = false)
    private HouseholdSplit householdSplit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false)
    private com.soict.entity.person.Person person;

    @Column(name = "is_head", nullable = false)
    private Boolean isHead = false;
}