package com.soict.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "persons")
@Data
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "household_id")
    private Household household;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String alias;

    private LocalDate dob;

    private String birthplace;

    private String origin;

    private String ethnicity;

    private String religion;

    private String occupation;

    private String workplace;

    @Column(name = "id_number", unique = true)
    private String idNumber;

    @Column(name = "id_issue_date")
    private LocalDate idIssueDate;

    @Column(name = "id_issue_place")
    private String idIssuePlace;

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @Column(name = "previous_address")
    private String previousAddress;

    @Column(name = "relation_to_head")
    private String relationToHead;

    @Column(columnDefinition = "VARCHAR(50) DEFAULT 'ACTIVE'")
    private String status;

    @Column(name = "moved_date")
    private LocalDate movedDate;

    @Column(name = "moved_to")
    private String movedTo;

    @Column(name = "deceased_date")
    private LocalDate deceasedDate;

    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}