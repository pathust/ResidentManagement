package com.soict.repository.household.event;

import com.soict.entity.household.event.HouseholdSplit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

// ========== HOUSEHOLD SPLIT REPOSITORY ==========
@Repository
public interface HouseholdSplitRepository extends JpaRepository<HouseholdSplit, Integer> {

    List<HouseholdSplit> findByFromHouseholdIdOrderBySplitDateDesc(Integer fromHouseholdId);

    List<HouseholdSplit> findByToHouseholdIdOrderBySplitDateDesc(Integer toHouseholdId);

    @Query("SELECT hs FROM HouseholdSplit hs WHERE hs.fromHousehold.id = :householdId " +
            "OR hs.toHousehold.id = :householdId ORDER BY hs.splitDate DESC")
    List<HouseholdSplit> findByHouseholdId(@Param("householdId") Integer householdId);

    @Query("SELECT hs FROM HouseholdSplit hs WHERE " +
            "hs.splitDate BETWEEN :startDate AND :endDate ORDER BY hs.splitDate DESC")
    List<HouseholdSplit> findBySplitDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(hs) FROM HouseholdSplit hs WHERE " +
            "(hs.fromHousehold.ward.id = :wardId OR hs.toHousehold.ward.id = :wardId) " +
            "AND YEAR(hs.splitDate) = :year")
    Long countByWardAndYear(@Param("wardId") Integer wardId, @Param("year") Integer year);
}
