package com.soict.mapper;

import com.soict.dto.person.PersonDTO;
import com.soict.entity.person.Person;
import com.soict.entity.household.HouseholdMembership;
import com.soict.repository.household.HouseholdRepository;
import com.soict.repository.household.HouseholdMembershipRepository;
import com.soict.repository.location.WardRepository;
import com.soict.repository.location.EthnicityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PersonMapper {

    private final HouseholdRepository householdRepository;
    private final HouseholdMembershipRepository membershipRepository;
    private final WardRepository wardRepository;
    private final EthnicityRepository ethnicityRepository;

    public PersonDTO toDTO(Person entity) {
        if (entity == null) return null;

        PersonDTO dto = new PersonDTO();

        // Basic fields
        dto.setId(entity.getId());
        dto.setFullName(entity.getFullName());
        dto.setDateOfBirth(entity.getDateOfBirth());
        dto.setPlaceOfBirth(entity.getPlaceOfBirth());
        dto.setGender(entity.getGender() != null ? entity.getGender().name() : null);
        dto.setOccupation(entity.getOccupation());
        dto.setWorkplace(entity.getWorkplace());
        dto.setReligion(entity.getReligion());

        // ID Information
        dto.setIdNumber(entity.getIdNumber());
        dto.setIdIssueDate(entity.getIdIssueDate());
        dto.setIdIssuePlace(entity.getIdIssuePlace());

        // Contact
        dto.setPhoneNumber(entity.getPhoneNumber());
        dto.setEmailAddress(entity.getEmailAddress());

        // Status
        dto.setStatus(entity.getStatus() != null ? entity.getStatus().name() : null);
        dto.setNotes(entity.getNotes());

        // Current Household
        if (entity.getCurrentHousehold() != null) {
            dto.setCurrentHouseholdId(entity.getCurrentHousehold().getId());

            // Get active household membership info
            Optional<HouseholdMembership> membership = membershipRepository
                    .findActiveByPersonId(entity.getId());

            membership.ifPresent(m -> {
                dto.setRelationToHead(m.getRelationToHead());
                dto.setIsHouseholdHead(m.getIsHouseholdHead());
                dto.setMembershipStartDate(m.getStartDate());
                dto.setMembershipEndDate(m.getEndDate());
            });
        }

        // Place of Origin
        if (entity.getPlaceOfOriginWard() != null) {
            dto.setPlaceOfOriginWardId(entity.getPlaceOfOriginWard().getId());
            dto.setPlaceOfOriginWardName(entity.getPlaceOfOriginWard().getName());
        }
        dto.setPlaceOfOriginDetails(entity.getPlaceOfOriginDetails());

        // Ethnicity
        if (entity.getEthnicity() != null) {
            dto.setEthnicityId(entity.getEthnicity().getId());
            dto.setEthnicityName(entity.getEthnicity().getName());
        }

        // Permanent Address
        if (entity.getPermAddressWard() != null) {
            dto.setPermAddressWardId(entity.getPermAddressWard().getId());
            dto.setPermAddressWardName(entity.getPermAddressWard().getName());
        }
        dto.setPermAddressDetails(entity.getPermAddressDetails());

        // Temporary Address
        if (entity.getTempAddressWard() != null) {
            dto.setTempAddressWardId(entity.getTempAddressWard().getId());
            dto.setTempAddressWardName(entity.getTempAddressWard().getName());
        }
        dto.setTempAddressDetails(entity.getTempAddressDetails());

        return dto;
    }

    public Person toEntity(PersonDTO dto) {
        if (dto == null) return null;

        Person entity = new Person();
        updateEntityFromDTO(dto, entity);
        return entity;
    }

    public void updateEntityFromDTO(PersonDTO dto, Person entity) {
        // Basic fields
        entity.setFullName(dto.getFullName());
        entity.setDateOfBirth(dto.getDateOfBirth());
        entity.setPlaceOfBirth(dto.getPlaceOfBirth());
        entity.setGender(dto.getGender() != null ? Person.Gender.valueOf(dto.getGender()) : null);
        entity.setOccupation(dto.getOccupation());
        entity.setWorkplace(dto.getWorkplace());
        entity.setReligion(dto.getReligion());

        // ID Information
        entity.setIdNumber(dto.getIdNumber());
        entity.setIdIssueDate(dto.getIdIssueDate());
        entity.setIdIssuePlace(dto.getIdIssuePlace());

        // Contact
        entity.setPhoneNumber(dto.getPhoneNumber());
        entity.setEmailAddress(dto.getEmailAddress());

        // Status
        entity.setStatus(dto.getStatus() != null ? Person.PersonStatus.valueOf(dto.getStatus()) : null);
        entity.setNotes(dto.getNotes());

        // Relationships - set by ID
        if (dto.getCurrentHouseholdId() != null) {
            householdRepository.findById(dto.getCurrentHouseholdId())
                    .ifPresent(entity::setCurrentHousehold);
        }

        if (dto.getPlaceOfOriginWardId() != null) {
            wardRepository.findById(dto.getPlaceOfOriginWardId())
                    .ifPresent(entity::setPlaceOfOriginWard);
        }
        entity.setPlaceOfOriginDetails(dto.getPlaceOfOriginDetails());

        if (dto.getEthnicityId() != null) {
            ethnicityRepository.findById(dto.getEthnicityId())
                    .ifPresent(entity::setEthnicity);
        }

        if (dto.getPermAddressWardId() != null) {
            wardRepository.findById(dto.getPermAddressWardId())
                    .ifPresent(entity::setPermAddressWard);
        }
        entity.setPermAddressDetails(dto.getPermAddressDetails());

        if (dto.getTempAddressWardId() != null) {
            wardRepository.findById(dto.getTempAddressWardId())
                    .ifPresent(entity::setTempAddressWard);
        }
        entity.setTempAddressDetails(dto.getTempAddressDetails());
    }
}