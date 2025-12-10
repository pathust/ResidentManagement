package com.soict.entity.household.event;

import com.soict.entity.household.Household;
import com.soict.entity.location.Ward;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "household_address_change")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdAddressChange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_address_ward_id", nullable = false)
    private Ward fromAddressWard;

    @Column(name = "from_address_details")
    private String fromAddressDetails;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_address_ward_id", nullable = false)
    private Ward toAddressWard;

    @Column(name = "to_address_details")
    private String toAddressDetails;

    @Column(name = "change_date", nullable = false)
    private LocalDate changeDate;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

}