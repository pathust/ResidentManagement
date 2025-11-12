package com.soict.repository.person.event;

import com.soict.entity.person.event.BirthDeclare;
import com.soict.entity.person.event.TemporaryResidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PersonTemporaryResidenceRepository extends JpaRepository<TemporaryResidence, Integer>, JpaSpecificationExecutor<TemporaryResidence> {

    @Query("SELECT tr FROM TemporaryResidence tr WHERE tr.person.id = :personId ORDER BY tr.startDate DESC")
    List<TemporaryResidence> findByPersonIdOrderByStartDateDesc(@Param("personId") Integer personId);

    @Query("""
           SELECT tr FROM TemporaryResidence tr
           JOIN tr.person p
           WHERE (:name IS NULL OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :name, '%')))
           ORDER BY tr.startDate DESC
           """)
    List<TemporaryResidence> findByPersonNameOrderByStartDateDesc(@Param("name") String name);

    @Query("""
           SELECT tr FROM TemporaryResidence tr
           JOIN tr.person p
           WHERE (:idNumber IS NULL OR LOWER(p.idNumber) = LOWER(:idNumber))
           ORDER BY tr.startDate DESC
           """)
    List<TemporaryResidence> findByPersonIdNumberOrderByStartDateDesc(@Param("idNumber") String idNumber);

    @Query("""
           SELECT tr FROM TemporaryResidence tr
           JOIN tr.currentHousehold ch
           WHERE (:householdId IS NULL OR ch.id = :householdId)
           ORDER BY tr.startDate DESC
           """)
    List<TemporaryResidence> findByHouseholdIdOrderByStartDateDesc(@Param("householdId") Integer householdId);

    @Query("""
           SELECT tr FROM TemporaryResidence tr
           JOIN tr.currentHousehold ch
           WHERE (:householdNumber IS NULL OR LOWER(ch.code) = LOWER(:householdNumber))
           ORDER BY tr.startDate DESC
           """)
    List<TemporaryResidence> findByHouseholdNumberOrderByStartDateDesc(@Param("householdNumber") String householdNumber);

    @Query("""
           SELECT tr FROM TemporaryResidence tr
           WHERE tr.startDate <= :endDate AND (tr.endDate IS NULL OR tr.endDate >= :startDate)
           ORDER BY tr.startDate DESC
           """)
    List<TemporaryResidence> findByStartDateAndEndDate(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("""
           SELECT tr FROM TemporaryResidence tr
           JOIN tr.tempAddressWard w
           WHERE (:wardName IS NULL OR LOWER(w.name) LIKE LOWER(CONCAT('%', :wardName, '%')))
           ORDER BY tr.startDate DESC
           """)
    List<TemporaryResidence> findByTempWardNameOrderByStartDateDesc(@Param("wardName") String wardName);
}