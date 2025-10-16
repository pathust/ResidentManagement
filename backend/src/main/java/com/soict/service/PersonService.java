package com.soict.service;

import com.soict.dto.person.PersonDTO;
import com.soict.entity.person.Person;
import com.soict.exception.ResourceNotFoundException;
import com.soict.mapper.PersonMapper;
import com.soict.repository.person.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PersonService {

    private final PersonRepository personRepository;
    private final PersonMapper personMapper;

    public List<PersonDTO> getAllPersons() {
        return personRepository.findAll().stream()
                .map(personMapper::toDTO)
                .collect(Collectors.toList());
    }

    public PersonDTO getPersonById(Integer id) {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with id: " + id));
        return personMapper.toDTO(person);
    }

    public List<PersonDTO> getPersonsByHouseholdId(Integer householdId) {
        return personRepository.findByCurrentHouseholdId(householdId).stream()
                .map(personMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PersonDTO createPerson(PersonDTO dto) {
        Person person = personMapper.toEntity(dto);
        Person saved = personRepository.save(person);
        return personMapper.toDTO(saved);
    }

    @Transactional
    public PersonDTO updatePerson(Integer id, PersonDTO dto) {
        Person existing = personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with id: " + id));

        personMapper.updateEntityFromDTO(dto, existing);
        Person updated = personRepository.save(existing);
        return personMapper.toDTO(updated);
    }

    @Transactional
    public void deletePerson(Integer id) {
        if (!personRepository.existsById(id)) {
            throw new ResourceNotFoundException("Person not found with id: " + id);
        }
        personRepository.deleteById(id);
    }
}