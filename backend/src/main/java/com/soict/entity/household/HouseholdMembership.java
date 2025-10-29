package com.soict.entity.household;

import com.soict.entity.location.Ward;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "household_membership")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdMembership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false)
    private com.soict.entity.person.Person person;

    @Column(name = "is_household_head", nullable = false)
    private Boolean isHouseholdHead = false;

    @Column(name = "relation_to_head", nullable = false, length = 45)
    private String relationToHead;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "registration_perm_date")
    private LocalDate registrationPermDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prev_perm_address_ward_id")
    private Ward prevPermAddressWard;

    @Column(name = "prev_perm_address_details")
    private String prevPermAddressDetails;
}