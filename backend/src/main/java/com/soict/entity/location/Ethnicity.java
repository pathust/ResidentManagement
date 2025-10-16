package com.soict.entity.location;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ethnicity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ethnicity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String name;
}