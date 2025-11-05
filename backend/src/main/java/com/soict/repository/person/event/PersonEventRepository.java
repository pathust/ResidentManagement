package com.soict.repository.person.event;

import com.soict.entity.person.event.PersonEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PersonEventRepository extends JpaRepository<PersonEvent, Integer> {

    List<PersonEvent> findByPersonIdOrderByEventDateDesc(Integer personId);

    List<PersonEvent> findByPersonIdAndEventTypeOrderByEventDateDesc(
            Integer personId, String eventType);

    @Query("SELECT pe FROM PersonEvent pe WHERE pe.person.id = :personId " +
            "AND pe.eventDate BETWEEN :startDate AND :endDate ORDER BY pe.eventDate DESC")
    List<PersonEvent> findByPersonIdAndDateRange(
            @Param("personId") Integer personId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT pe FROM PersonEvent pe WHERE pe.eventType = :eventType " +
            "AND pe.eventDate >= :fromDate ORDER BY pe.eventDate DESC")
    List<PersonEvent> findRecentEventsByType(
            @Param("eventType") String eventType,
            @Param("fromDate") LocalDate fromDate);

    @Query("SELECT pe FROM PersonEvent pe WHERE pe.person.permAddressWard = :wardId " +
            "AND pe.eventDate BETWEEN :startDate AND :endDate ORDER BY pe.eventDate DESC")
    List<PersonEvent> findByWardAndDateRange(
            @Param("wardId") Integer wardId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}

