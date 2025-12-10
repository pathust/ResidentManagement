package com.soict.entity.person.event;

import com.soict.entity.person.Person;
import com.soict.entity.household.Household;
import com.soict.entity.location.Ward;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "permanent_residence_change")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PermanentResidenceChange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @ManyToOne
    @JoinColumn(name = "current_household_id", nullable = false)
    private Household currentHousehold;

    @ManyToOne
    @JoinColumn(name = "prev_address_ward_id")
    private Ward prevAddressWard;

    @Column(name = "prev_address_details")
    private String prevAddressDetails;

    @ManyToOne
    @JoinColumn(name = "address_ward_id", nullable = false)
    private Ward addressWard;

    @Column(name = "address_details")
    private String addressDetails;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String details;
}
