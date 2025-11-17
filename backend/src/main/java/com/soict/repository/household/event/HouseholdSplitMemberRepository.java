package com.soict.repository.household.event;

import com.soict.entity.household.event.HouseholdSplitMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// ========== HOUSEHOLD SPLIT MEMBER REPOSITORY ==========
@Repository
public interface HouseholdSplitMemberRepository extends JpaRepository<HouseholdSplitMember, Integer>, JpaSpecificationExecutor<HouseholdSplitMember> {

    List<HouseholdSplitMember> findByHouseholdSplitId(Integer householdSplitId);
    List<HouseholdSplitMember> findByHouseholdSplitIdOrderByIdAsc(Integer splitId);

    @Query("SELECT hsm FROM HouseholdSplitMember hsm WHERE hsm.person.id = :personId")
    List<HouseholdSplitMember> findByPersonId(@Param("personId") Integer personId);

    @Query("SELECT hsm FROM HouseholdSplitMember hsm WHERE hsm.householdSplit.id = :splitId " +
            "AND hsm.isHead = true")
    Optional<HouseholdSplitMember> findHeadBySplitId(@Param("splitId") Integer splitId);

    @Query("SELECT COUNT(hsm) FROM HouseholdSplitMember hsm WHERE hsm.householdSplit.id = :splitId")
    Long countBySplitId(@Param("splitId") Integer splitId);

    void deleteByHouseholdSplitId(Integer splitId);
}
