package com.soict.repository.household;

import com.soict.entity.household.Household;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HouseholdRepository extends JpaRepository<Household, Integer> {
    Optional<Household> findByCode(String code);
    boolean existsByCode(String code);
}