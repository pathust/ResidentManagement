package com.soict.repository.person.event;

import com.soict.entity.person.event.BirthDeclare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PersonBirthDeclareRepository extends JpaRepository<BirthDeclare, Integer>, JpaSpecificationExecutor<BirthDeclare> {

    @Query("SELECT bd FROM BirthDeclare bd WHERE bd.person.id = :personId ORDER BY bd.dateOfDeclaration DESC")
    List<BirthDeclare> findByPersonIdOrderByDeclareDateDesc(@Param("personId") Integer personId);

    @Query("""
           SELECT bd FROM BirthDeclare bd
           JOIN bd.person p
           WHERE (:name IS NULL OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :name, '%')))
           ORDER BY bd.dateOfDeclaration DESC
           """)
    List<BirthDeclare> findByPersonNameOrderByDeclareDateDesc(@Param("name") String name);

    @Query("""
           SELECT bd FROM BirthDeclare bd
           JOIN bd.person p
           WHERE (:idNumber IS NULL OR LOWER(p.idNumber) = LOWER(:idNumber))
           ORDER BY bd.dateOfDeclaration DESC
           """)
    List<BirthDeclare> findByPersonIdNumberOrderByDeclareDateDesc(@Param("idNumber") String idNumber);

    @Query("""
           SELECT bd FROM BirthDeclare bd
           JOIN bd.person p
           WHERE (:householdId IS NULL OR p.currentHouseholdId = :householdId)
           ORDER BY bd.dateOfDeclaration DESC
           """)
    List<BirthDeclare> findByHouseholdIdOrderByDeclareDateDesc(@Param("householdId") Integer householdId);

    @Query("""
           SELECT bd FROM BirthDeclare bd
           JOIN bd.person p
           JOIN p.currentHousehold ch
           WHERE (:householdNumber IS NULL OR LOWER(ch.code) = LOWER(:householdNumber))
           ORDER BY bd.dateOfDeclaration DESC
           """)
    List<BirthDeclare> findByHouseholdNumberOrderByDeclareDateDesc(@Param("householdNumber") String householdNumber);
}