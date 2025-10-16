package com.soict.entity.location;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "province")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Province {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false, length = 45)
    private String name;

    @OneToMany(mappedBy = "province")
    private Set<Ward> wards;
}