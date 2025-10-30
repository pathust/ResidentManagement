package com.soict.repository.household.event;

import com.soict.entity.household.event.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HouseholdEventRepository extends JpaRepository<HouseholdEvent, Integer> {

    List<HouseholdEvent> findByHouseholdIdOrderByEventDateDesc(Integer householdId);

    List<HouseholdEvent> findByHouseholdIdAndEventTypeOrderByEventDateDesc(
            Integer householdId, String eventType);

    @Query("SELECT he FROM HouseholdEvent he WHERE he.household.id = :householdId " +
            "AND he.eventDate BETWEEN :startDate AND :endDate ORDER BY he.eventDate DESC")
    List<HouseholdEvent> findByHouseholdIdAndDateRange(
            @Param("householdId") Integer householdId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT he FROM HouseholdEvent he WHERE he.eventType = :eventType " +
            "AND he.eventDate >= :fromDate ORDER BY he.eventDate DESC")
    List<HouseholdEvent> findRecentEventsByType(
            @Param("eventType") String eventType,
            @Param("fromDate") LocalDate fromDate);

    @Query("SELECT he FROM HouseholdEvent he WHERE he.household.ward.id = :wardId " +
            "AND he.eventDate BETWEEN :startDate AND :endDate ORDER BY he.eventDate DESC")
    List<HouseholdEvent> findByWardAndDateRange(
            @Param("wardId") Integer wardId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}

