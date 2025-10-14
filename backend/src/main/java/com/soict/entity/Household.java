package com.soict.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "households")
@Data
public class Household {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String code;

    @ManyToOne
    @JoinColumn(name = "head_person_id")
    private Person headPerson;

    @Column(name = "address_street")
    private String addressStreet;

    @Column(name = "address_ward")
    private String addressWard;

    @Column(name = "address_district")
    private String addressDistrict;

    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "household", cascade = CascadeType.ALL)
    private List<Person> persons;
}