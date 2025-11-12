package com.soict.repository.person.event;

import com.soict.entity.person.event.PermanentResidenceChange;
import com.soict.entity.person.event.TemporaryAbsence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PersonPermanentResidenceChangeRepository extends JpaRepository<PermanentResidenceChange, Integer>, JpaSpecificationExecutor<PermanentResidenceChange> {

    @Query("SELECT prc FROM PermanentResidenceChange prc WHERE prc.person.id = :personId ORDER BY prc.startDate DESC")
    List<PermanentResidenceChange> findByPersonIdOrderByStartDateDesc(@Param("personId") Integer personId);

    @Query("""
           SELECT prc FROM PermanentResidenceChange prc
           JOIN prc.person p
           WHERE (:name IS NULL OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :name, '%')))
           ORDER BY prc.startDate DESC
           """)
    List<PermanentResidenceChange> findByPersonNameOrderByStartDateDesc(@Param("name") String name);

    @Query("""
           SELECT prc FROM PermanentResidenceChange prc
           JOIN prc.person p
           WHERE (:idNumber IS NULL OR LOWER(p.idNumber) = LOWER(:idNumber))
           ORDER BY prc.startDate DESC
           """)
    List<PermanentResidenceChange> findByPersonIdNumberOrderByStartDateDesc(@Param("idNumber") String idNumber);

    @Query("""
           SELECT prc FROM PermanentResidenceChange prc
           JOIN prc.currentHousehold ch
           WHERE (:householdId IS NULL OR ch.id = :householdId)
           ORDER BY prc.startDate DESC
           """)
    List<PermanentResidenceChange> findByHouseholdIdOrderByStartDateDesc(@Param("householdId") Integer householdId);

    @Query("""
           SELECT prc FROM PermanentResidenceChange prc
           JOIN prc.currentHousehold ch
           WHERE (:householdNumber IS NULL OR LOWER(ch.code) = LOWER(:householdNumber))
           ORDER BY prc.startDate DESC
           """)
    List<PermanentResidenceChange> findByHouseholdNumberOrderByStartDateDesc(@Param("householdNumber") String householdNumber);

    @Query("""
           SELECT prc FROM PermanentResidenceChange prc
           WHERE prc.startDate <= :endDate AND prc.startDate >= :startDate
           ORDER BY prc.startDate DESC
           """)
    List<PermanentResidenceChange> findByStartDateAndEndDate(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("""
           SELECT prc FROM PermanentResidenceChange prc
           JOIN prc.prevAddressWard w
           WHERE (:wardName IS NULL OR LOWER(w.name) LIKE LOWER(CONCAT('%', :wardName, '%')))
           ORDER BY prc.startDate DESC
           """)
    List<PermanentResidenceChange> findByPrevWardNameOrderByStartDateDesc(@Param("wardName") String wardName);
    
    @Query("""
           SELECT prc FROM PermanentResidenceChange prc
           JOIN prc.addressWard w
           WHERE (:wardName IS NULL OR LOWER(w.name) LIKE LOWER(CONCAT('%', :wardName, '%')))
           ORDER BY prc.startDate DESC
           """)
    List<PermanentResidenceChange> findByWardNameOrderByStartDateDesc(@Param("wardName") String wardName);

    @Query("""
           SELECT prc FROM PermanentResidenceChange prc
           JOIN prc.prevAddressWard w
           WHERE (:wardId IS NULL OR w.id = :wardId)
           ORDER BY prc.startDate DESC
           """)
    List<PermanentResidenceChange> findByPrevWardIdOrderByStartDateDesc(@Param("wardId") Integer wardId);

    @Query("""
           SELECT prc FROM PermanentResidenceChange prc
           JOIN prc.addressWard w
           WHERE (:wardId IS NULL OR w.id = :wardId)
           ORDER BY prc.startDate DESC
           """)
    List<PermanentResidenceChange> findByWardIdOrderByStartDateDesc(@Param("wardId") Integer wardId);
}