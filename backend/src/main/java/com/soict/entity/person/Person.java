package com.soict.entity.person;

import com.soict.entity.household.Household;
import com.soict.entity.location.Ethnicity;
import com.soict.entity.location.Ward;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "persons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "current_household_id")
    private Integer currentHouseholdId;

    @ManyToOne
    @JoinColumn(name = "current_household_id", insertable = false, updatable = false)
    private Household currentHousehold;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "place_of_birth")
    private String placeOfBirth;

    @Column(name = "place_of_origin_ward_id")
    private Integer placeOfOriginWardId;

    @ManyToOne
    @JoinColumn(name = "place_of_origin_ward_id",  insertable = false, updatable = false)
    private Ward placeOfOriginWard;

    @Column(name = "place_of_origin_details")
    private String placeOfOriginDetails;

    @Column(name = "ethnicity_id")
    private Integer ethnicityId;

    @ManyToOne
    @JoinColumn(name = "ethnicity_id",   insertable = false, updatable = false)
    private Ethnicity ethnicity;

    private String religion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    private String occupation;

    private String workplace;

    @Column(name = "id_number", unique = true, length = 50)
    private String idNumber;

    @Column(name = "id_issue_date")
    private LocalDate idIssueDate;

    @Column(name = "id_issue_place")
    private String idIssuePlace;

    @Column(name = "perm_address_ward_id")
    private Integer permAddressWardId;

    @ManyToOne
    @JoinColumn(name = "perm_address_ward_id",   insertable = false, updatable = false)
    private Ward permAddressWard;

    @Column(name = "perm_address_details")
    private String permAddressDetails;

    @Column(name = "temp_address_ward_id")
    private Integer tempAddressWardId;

    @ManyToOne
    @JoinColumn(name = "temp_address_ward_id",    insertable = false, updatable = false)
    private Ward tempAddressWard;

    @Column(name = "temp_address_details")
    private String tempAddressDetails;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @Column(name = "email_address")
    private String emailAddress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PersonStatus status = PersonStatus.ALIVE;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Gender {
        M, F, X
    }

    public enum PersonStatus {
        ALIVE, DEAD
    }
}