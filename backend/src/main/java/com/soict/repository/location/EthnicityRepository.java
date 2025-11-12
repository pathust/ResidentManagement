package com.soict.repository.location;

import com.soict.entity.location.Ethnicity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EthnicityRepository extends JpaRepository<Ethnicity, Integer> {
    boolean existsByName(String name);
}