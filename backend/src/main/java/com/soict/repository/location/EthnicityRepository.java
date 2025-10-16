package com.soict.repository.location;

import com.soict.entity.location.Ethnicity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EthnicityRepository extends JpaRepository<Ethnicity, Integer> {
    Optional<Ethnicity> findByName(String name);
    boolean existsByName(String name);
}