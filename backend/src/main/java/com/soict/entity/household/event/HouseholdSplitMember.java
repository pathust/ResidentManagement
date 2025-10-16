package com.soict.entity.household.event;

import com.soict.entity.person.Person;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "household_split_member")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdSplitMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "household_split_id", nullable = false)
    private HouseholdSplit householdSplit;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @Column(name = "is_head", nullable = false)
    private Boolean isHead = false;
}