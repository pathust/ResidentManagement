package com.soict.repository.household;

import com.soict.entity.household.Household;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface HouseholdRepository extends JpaRepository<Household, Integer>,
        JpaSpecificationExecutor<Household> {

    boolean existsByCode(String code);
}