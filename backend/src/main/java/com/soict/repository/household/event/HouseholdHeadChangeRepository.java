package com.soict.repository.household.event;

import com.soict.entity.household.event.HouseholdAddressChange;
import com.soict.entity.household.event.HouseholdHeadChange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HouseholdHeadChangeRepository extends JpaRepository<HouseholdHeadChange, Integer>, JpaSpecificationExecutor<HouseholdHeadChange> {

    List<HouseholdHeadChange> findByHouseholdIdOrderByChangeDateDesc(Integer householdId);

    @Query("SELECT hhc FROM HouseholdHeadChange hhc WHERE hhc.fromPerson.id = :personId " +
            "OR hhc.toPerson.id = :personId ORDER BY hhc.changeDate DESC")
    List<HouseholdHeadChange> findByPersonId(@Param("personId") Integer personId);

    @Query("SELECT hhc FROM HouseholdHeadChange hhc WHERE hhc.household.ward.id = :wardId " +
            "AND hhc.changeDate BETWEEN :startDate AND :endDate ORDER BY hhc.changeDate DESC")
    List<HouseholdHeadChange> findByWardAndDateRange(
            @Param("wardId") Integer wardId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
