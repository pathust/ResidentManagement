package com.soict.service;

import com.soict.dto.PersonDTO;
import com.soict.entity.Person;
import com.soict.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PersonService {

    private final PersonRepository personRepository;

    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public List<PersonDTO> getAllPersons() {
        return personRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private PersonDTO toDTO(Person entity) {
        PersonDTO dto = new PersonDTO();
        dto.setId(entity.getId());
        dto.setFullName(entity.getFullName());
        dto.setRelationToHead(entity.getRelationToHead());
        return dto;
    }
}