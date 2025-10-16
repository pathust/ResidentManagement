package com.soict.repository.person;

import com.soict.entity.person.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, Integer> {
    Optional<Person> findByIdNumber(String idNumber);
    List<Person> findByCurrentHouseholdId(Integer householdId);
    List<Person> findByFullNameContainingIgnoreCase(String name);
}