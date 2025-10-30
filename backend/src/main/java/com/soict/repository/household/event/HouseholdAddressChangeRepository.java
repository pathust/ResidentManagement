package com.soict.repository.household.event;

import com.soict.entity.household.event.HouseholdAddressChange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

// ========== HOUSEHOLD ADDRESS CHANGE REPOSITORY ==========
@Repository
public interface HouseholdAddressChangeRepository extends JpaRepository<HouseholdAddressChange, Integer> {

    List<HouseholdAddressChange> findByHouseholdIdOrderByChangeDateDesc(Integer householdId);

    @Query("SELECT hac FROM HouseholdAddressChange hac WHERE hac.toAddressWardId = :wardId " +
            "OR hac.fromAddressWard.id = :wardId ORDER BY hac.changeDate DESC")
    List<HouseholdAddressChange> findByWardId(@Param("wardId") Integer wardId);

    @Query("SELECT hac FROM HouseholdAddressChange hac WHERE " +
            "hac.changeDate BETWEEN :startDate AND :endDate ORDER BY hac.changeDate DESC")
    List<HouseholdAddressChange> findByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(hac) FROM HouseholdAddressChange hac WHERE hac.toAddressWardId = :wardId " +
            "AND YEAR(hac.changeDate) = :year")
    Long countMovingInByWardAndYear(@Param("wardId") Integer wardId, @Param("year") Integer year);

    @Query("SELECT COUNT(hac) FROM HouseholdAddressChange hac WHERE hac.fromAddressWard.id = :wardId " +
            "AND YEAR(hac.changeDate) = :year")
    Long countMovingOutByWardAndYear(@Param("wardId") Integer wardId, @Param("year") Integer year);
}
