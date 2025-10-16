package com.soict.entity.person.event;

import com.soict.entity.person.Person;
import com.soict.entity.location.Ward;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "death_declare")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeathDeclare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @ManyToOne
    @JoinColumn(name = "declarer_id", nullable = false)
    private Person declarer;

    @Column(name = "date_of_declaration", nullable = false)
    private LocalDate dateOfDeclaration;

    @Column(name = "time_of_death")
    private LocalDateTime timeOfDeath;

    @ManyToOne
    @JoinColumn(name = "last_permanent_residence_ward_id", nullable = false)
    private Ward lastPermanentResidenceWard;

    @Column(name = "last_permanent_residence_details")
    private String lastPermanentResidenceDetails;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}