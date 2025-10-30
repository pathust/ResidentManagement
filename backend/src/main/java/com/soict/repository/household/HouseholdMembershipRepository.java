package com.soict.repository.household;

import com.soict.entity.household.HouseholdMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HouseholdMembershipRepository extends JpaRepository<HouseholdMembership, Integer> {
    @Query("SELECT hm FROM HouseholdMembership hm WHERE hm.household.id = :householdId AND hm.endDate IS NULL")
    List<HouseholdMembership> findActiveByHouseholdId(@Param("householdId") Integer householdId);

    @Query("SELECT hm FROM HouseholdMembership hm WHERE hm.person.id = :personId AND hm.endDate IS NULL")
    Optional<HouseholdMembership> findActiveByPersonId(@Param("personId") Integer personId);

    boolean existsByPersonIdAndIsHouseholdHeadAndEndDateIsNull(Integer personId, Boolean isHouseholdHead);

    @Query("SELECT hm FROM HouseholdMembership hm WHERE hm.household.id = :householdId " +
            "AND hm.isHouseholdHead = true AND hm.endDate IS NULL")
    Optional<HouseholdMembership> findActiveHeadByHouseholdId(@Param("householdId") Integer householdId);

    @Query("SELECT COUNT(hm) FROM HouseholdMembership hm " +
            "WHERE hm.household.id = :householdId AND hm.endDate IS NULL")
    Long countActiveMembers(@Param("householdId") Integer householdId);
}