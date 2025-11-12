package com.soict.repository.person.event;

import com.soict.entity.person.event.TemporaryAbsence;
import com.soict.entity.person.event.TemporaryResidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PersonTemporaryAbsenceRepository extends JpaRepository<TemporaryAbsence, Integer>, JpaSpecificationExecutor<TemporaryAbsence> {

    @Query("SELECT ta FROM TemporaryAbsence ta WHERE ta.person.id = :personId ORDER BY ta.startDate DESC")
    List<TemporaryAbsence> findByPersonIdOrderByStartDateDesc(@Param("personId") Integer personId);

    @Query("""
           SELECT ta FROM TemporaryAbsence ta
           JOIN ta.person p
           WHERE (:name IS NULL OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :name, '%')))
           ORDER BY ta.startDate DESC
           """)
    List<TemporaryAbsence> findByPersonNameOrderByStartDateDesc(@Param("name") String name);

    @Query("""
           SELECT ta FROM TemporaryAbsence ta
           JOIN ta.person p
           WHERE (:idNumber IS NULL OR LOWER(p.idNumber) = LOWER(:idNumber))
           ORDER BY ta.startDate DESC
           """)
    List<TemporaryAbsence> findByPersonIdNumberOrderByStartDateDesc(@Param("idNumber") String idNumber);

    @Query("""
           SELECT ta FROM TemporaryAbsence ta
           WHERE (:householdId IS NULL OR ta.currentHousehold.id = :householdId)
           ORDER BY ta.startDate DESC
           """)
    List<TemporaryAbsence> findByHouseholdIdOrderByStartDateDesc(@Param("householdId") Integer householdId);

    @Query("""
           SELECT ta FROM TemporaryAbsence ta
           JOIN ta.currentHousehold ch
           WHERE (:householdNumber IS NULL OR LOWER(ch.code) = LOWER(:householdNumber))
           ORDER BY ta.startDate DESC
           """)
    List<TemporaryAbsence> findByHouseholdNumberOrderByStartDateDesc(@Param("householdNumber") String householdNumber);

    @Query("""
           SELECT ta FROM TemporaryAbsence ta
           WHERE ta.startDate <= :endDate AND (ta.endDate IS NULL OR ta.endDate >= :startDate)
           ORDER BY ta.startDate DESC
           """)
    List<TemporaryAbsence> findByStartDateAndEndDate(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("""
           SELECT ta FROM TemporaryAbsence ta
           JOIN ta.tempAddressWard w
           WHERE (:wardName IS NULL OR LOWER(w.name) LIKE LOWER(CONCAT('%', :wardName, '%')))
           ORDER BY ta.startDate DESC
           """)
    List<TemporaryAbsence> findByTempWardNameOrderByStartDateDesc(@Param("wardName") String wardName);

    @Query("""
           SELECT ta FROM TemporaryAbsence ta
           JOIN ta.tempAddressWard w
           WHERE (:wardId IS NULL OR w.id = :wardId)
           ORDER BY ta.startDate DESC
           """)
    List<TemporaryAbsence> findByTempWardIdOrderByStartDateDesc(@Param("wardId") Integer wardId);

    @Query("""
           SELECT ta FROM TemporaryAbsence ta
           JOIN ta.permAddressWard w
           WHERE (:wardName IS NULL OR LOWER(w.name) LIKE LOWER(CONCAT('%', :wardName, '%')))
           ORDER BY ta.startDate DESC
           """)
    List<TemporaryAbsence> findByPermWardNameOrderByStartDateDesc(@Param("wardName") String wardName);

    @Query("""
           SELECT ta FROM TemporaryAbsence ta
           JOIN ta.permAddressWard w
           WHERE (:wardId IS NULL OR w.id = :wardId)
           ORDER BY ta.startDate DESC
           """)
    List<TemporaryAbsence> findByPermWardIdOrderByStartDateDesc(@Param("wardId") Integer wardId);
}