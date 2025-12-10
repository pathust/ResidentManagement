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
@Table(name = "temporary_absence")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TemporaryAbsence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @ManyToOne
    @JoinColumn(name = "current_household_id", nullable = false)
    private Household currentHousehold;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(columnDefinition = "TEXT")
    private String destination;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @ManyToOne
    @JoinColumn(name = "perm_address_ward_id", nullable = false)
    private Ward permAddressWard;

    @ManyToOne
    @JoinColumn(name = "temp_address_ward_id")
    private Ward tempAddressWard;

    @Column(name = "perm_address_details")
    private String permAddressDetails;

    @Column(name = "temp_address_details")
    private String tempAddressDetails;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}