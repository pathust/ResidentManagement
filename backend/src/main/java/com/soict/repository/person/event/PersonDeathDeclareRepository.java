package com.soict.repository.person.event;

import com.soict.entity.person.event.BirthDeclare;
import com.soict.entity.person.event.DeathDeclare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonDeathDeclareRepository extends JpaRepository<DeathDeclare, Integer>, JpaSpecificationExecutor<DeathDeclare>  {

    @Query("SELECT dd FROM DeathDeclare dd WHERE dd.person.id = :personId ORDER BY dd.dateOfDeclaration DESC")
    List<DeathDeclare> findByPersonIdOrderByDeclareDateDesc(@Param("personId") Integer personId);

    @Query("""
           SELECT dd FROM DeathDeclare dd
           JOIN dd.person p
           WHERE (:name IS NULL OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :name, '%')))
           ORDER BY dd.dateOfDeclaration DESC
           """)
    List<DeathDeclare> findByPersonNameOrderByDeclareDateDesc(@Param("name") String name);

    @Query("""
           SELECT dd FROM DeathDeclare dd
           JOIN dd.person p
           WHERE (:idNumber IS NULL OR LOWER(p.idNumber) = LOWER(:idNumber))
           ORDER BY dd.dateOfDeclaration DESC
           """)
    List<DeathDeclare> findByPersonIdNumberOrderByDeclareDateDesc(@Param("idNumber") String idNumber);

    @Query("""
           SELECT dd FROM DeathDeclare dd
           JOIN dd.person p
           WHERE (:householdId IS NULL OR p.currentHouseholdId = :householdId)
           ORDER BY dd.dateOfDeclaration DESC
           """)
    List<DeathDeclare> findByHouseholdIdOrderByDeclareDateDesc(@Param("householdId") Integer householdId);

    @Query("""
           SELECT dd FROM DeathDeclare dd
           JOIN dd.person p
           JOIN p.currentHousehold ch
           WHERE (:householdNumber IS NULL OR LOWER(ch.code) = LOWER(:householdNumber))
           ORDER BY dd.dateOfDeclaration DESC
           """)
    List<DeathDeclare> findByHouseholdNumberOrderByDeclareDateDesc(@Param("householdNumber") String householdNumber);
}