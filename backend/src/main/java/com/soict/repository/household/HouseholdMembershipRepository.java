package com.soict.repository.household;

import com.soict.entity.household.HouseholdMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HouseholdMembershipRepository extends JpaRepository<HouseholdMembership, Integer> {

    List<HouseholdMembership> findByHouseholdId(Integer householdId);

    List<HouseholdMembership> findByPersonId(Integer personId);

    // Find active memberships (endDate is null)
    @Query("SELECT hm FROM HouseholdMembership hm WHERE hm.household.id = :householdId AND hm.endDate IS NULL")
    List<HouseholdMembership> findActiveByHouseholdId(Integer householdId);

    @Query("SELECT hm FROM HouseholdMembership hm WHERE hm.person.id = :personId AND hm.endDate IS NULL")
    Optional<HouseholdMembership> findActiveByPersonId(Integer personId);

    // Find household head
    @Query("SELECT hm FROM HouseholdMembership hm WHERE hm.household.id = :householdId AND hm.isHouseholdHead = true AND hm.endDate IS NULL")
    Optional<HouseholdMembership> findHouseholdHead(Integer householdId);
}
