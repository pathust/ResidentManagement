package com.soict.entity.person.event;

import com.soict.entity.person.Person;
import com.soict.entity.location.Ward;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "birth_declare")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BirthDeclare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @ManyToOne
    @JoinColumn(name = "declarer_id", nullable = false)
    private Person declarer;

    @ManyToOne
    @JoinColumn(name = "father_id")
    private Person father;

    @ManyToOne
    @JoinColumn(name = "mother_id")
    private Person mother;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "date_of_declaration", nullable = false)
    private LocalDate dateOfDeclaration;

    @Column(name = "place_of_birth", nullable = false)
    private String placeOfBirth;

    @ManyToOne
    @JoinColumn(name = "place_of_origin_ward_id", nullable = false)
    private Ward placeOfOriginWard;

    @Column(name = "place_of_origin_details")
    private String placeOfOriginDetails;

    @Column(name = "relation_with_declarer", nullable = false, length = 45)
    private String relationWithDeclarer;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String note;
}
