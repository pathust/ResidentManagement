package com.soict.repository.person;

import com.soict.entity.person.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, Integer>, JpaSpecificationExecutor<Person> {

    boolean existsByIdNumber(String idNumber);

    @Query("SELECT p FROM Person p WHERE p.id = :id")
    List <Person> findPersonById(@Param("id") Integer id);

    @Query("SELECT p FROM Person p WHERE p.idNumber = TRIM(:idNumber)")
    Optional<Person> findPersonByIdNumber(@Param("idNumber") String idNumber);
}

