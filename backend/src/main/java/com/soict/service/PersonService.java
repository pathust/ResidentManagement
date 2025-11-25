package com.soict.service;

import com.soict.dto.person.*;
import com.soict.entity.person.*;
import com.soict.exception.ResourceNotFoundException;
import com.soict.exception.BusinessException;
import com.soict.mapper.person.PersonMapper;
import com.soict.repository.person.*;
import com.soict.repository.household.HouseholdMembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PersonService {

    private final PersonRepository personRepository;
    private final HouseholdMembershipRepository householdMembershipRepository;
    private final PersonMapper personMapper;

    // ========== BASIC CRUD ==========

    public List<PersonDTO> getAllPersons() {
        return personRepository.findAll().stream()
                .map(personMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Page<PersonDTO> getAllPersonsPaginated(Pageable pageable, String search, Integer wardId, String status) {
        Specification<Person> spec = Specification.where(null);

        if (search != null && !search.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("fullName")), "%" + search.toLowerCase() + "%"),
                    cb.like(root.get("idNumber"), "%" + search + "%"),
                    cb.like(root.get("phoneNumber"), "%" + search + "%")
            ));
        }

        if (wardId != null) {
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.equal(root.get("permAddressWardId"), wardId),
                    cb.equal(root.get("currentHousehold").get("wardId"), wardId)
            ));
        }

        if (status != null && !status.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        return personRepository.findAll(spec, pageable)
                .map(personMapper::toDTO);
    }

    public PersonDTO getPersonById(Integer id) {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with id: " + id));
        return personMapper.toDTO(person);
    }

    @Transactional
    public PersonDTO createPerson(PersonCreateDTO dto) {
        // Validate unique ID number if provided
        if (dto.getIdNumber() != null && !dto.getIdNumber().isEmpty()) {
            if (personRepository.existsByIdNumber(dto.getIdNumber())) {
                throw new BusinessException("ID number already exists: " + dto.getIdNumber());
            }
        }

        Person person = personMapper.toEntity(dto);
        Person saved = personRepository.save(person);

        return personMapper.toDTO(saved);
    }

    @Transactional
    public PersonDTO updatePerson(Integer id, PersonUpdateDTO dto) {
        Person existing = personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with id: " + id));

        // Validate unique ID number if changed
        if (dto.getIdNumber() != null && !dto.getIdNumber().equals(existing.getIdNumber())) {
            if (personRepository.existsByIdNumber(dto.getIdNumber())) {
                throw new BusinessException("ID number already exists: " + dto.getIdNumber());
            }
        }

        personMapper.updateEntityFromDTO(dto, existing);
        Person updated = personRepository.save(existing);
        return personMapper.toDTO(updated);
    }

    @Transactional
    public void deletePerson(Integer id) {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with id: " + id));

        // Check if person is head of any household
        if (householdMembershipRepository.existsByPersonIdAndIsHouseholdHeadAndEndDateIsNull(id, true)) {
            throw new BusinessException("Cannot delete person who is currently a household head");
        }

        personRepository.deleteById(id);
    }
}