package com.soict.service;

import com.soict.dto.household.*;
import com.soict.entity.household.*;
import com.soict.entity.person.Person;
import com.soict.exception.ResourceNotFoundException;
import com.soict.exception.BusinessException;
import com.soict.mapper.household.HouseholdMapper;
import com.soict.repository.household.*;
import com.soict.repository.person.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HouseholdService {

    private final HouseholdRepository householdRepository;
    private final HouseholdMembershipRepository membershipRepository;
    private final PersonRepository personRepository;
    private final HouseholdMapper householdMapper;

    // ========== BASIC CRUD ==========

    public Page<HouseholdDTO> getAllHouseholds(Pageable pageable, Integer wardId, String search) {
        Specification<Household> spec = Specification.where(null);

        if (wardId != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("ward").get("id"), wardId));
        }

        if (search != null && !search.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("code")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("houseAddressDetails")), "%" + search.toLowerCase() + "%")
            ));
        }

        return householdRepository.findAll(spec, pageable)
                .map(householdMapper::toDTO);
    }

    public HouseholdDetailDTO getHouseholdById(Integer id) {
        Household household = householdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + id));

        HouseholdDetailDTO dto = householdMapper.toDetailDTO(household);

        // Load active members
        List<HouseholdMembership> memberships = membershipRepository.findActiveByHouseholdId(id);
        List<HouseholdMemberDTO> members = memberships.stream()
                .map(householdMapper::toMemberDTO)
                .collect(Collectors.toList());
        dto.setMembers(members);

        return dto;
    }

    @Transactional
    public HouseholdDTO createHousehold(HouseholdCreateDTO dto) {
        // Check unique code
        if (householdRepository.existsByCode(dto.getCode())) {
            throw new BusinessException("Household code already exists: " + dto.getCode());
        }

        Household household = householdMapper.toEntity(dto);
        Household saved = householdRepository.save(household);

        // TODO: Create household event

        return householdMapper.toDTO(saved);
    }

    @Transactional
    public HouseholdDTO updateHousehold(Integer id, HouseholdUpdateDTO dto) {
        Household existing = householdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + id));

        householdMapper.updateEntityFromDTO(dto, existing);
        Household updated = householdRepository.save(existing);

        return householdMapper.toDTO(updated);
    }

    @Transactional
    public void deleteHousehold(Integer id) {
        Household household = householdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + id));

        // Check if household has active members
        long activeMemberCount = membershipRepository.countActiveMembers(id);
        if (activeMemberCount > 0) {
            throw new BusinessException("Cannot delete household with active members");
        }

        householdRepository.deleteById(id);
    }

    // ========== MEMBERSHIP MANAGEMENT ==========

    @Transactional
    public HouseholdMembershipDTO addMember(Integer householdId, HouseholdMembershipCreateDTO dto) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + householdId));

        Person person = personRepository.findById(dto.getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with id: " + dto.getPersonId()));

        // Check if person already has active membership
        if (membershipRepository.findActiveByPersonId(dto.getPersonId()).isPresent()) {
            throw new BusinessException("Person already belongs to an active household");
        }

        // If adding as head, check if household already has a head
        if (dto.getIsHouseholdHead()) {
            if (membershipRepository.findActiveHeadByHouseholdId(householdId).isPresent()) {
                throw new BusinessException("Household already has an active head");
            }
        }

        HouseholdMembership membership = householdMapper.toMembershipEntity(dto);
        membership.setHousehold(household);
        membership.setPerson(person);

        HouseholdMembership saved = membershipRepository.save(membership);

        // Update person's current household
        person.setCurrentHousehold(household);
        personRepository.save(person);

        // TODO: Create household event

        return householdMapper.toMembershipDTO(saved);
    }

    @Transactional
    public void removeMember(Integer householdId, Integer membershipId) {
        HouseholdMembership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found with id: " + membershipId));

        if (!membership.getHousehold().getId().equals(householdId)) {
            throw new BusinessException("Membership does not belong to this household");
        }

        if (membership.getEndDate() != null) {
            throw new BusinessException("Membership already ended");
        }

        // Cannot remove household head directly
        if (membership.getIsHouseholdHead()) {
            throw new BusinessException("Cannot remove household head. Change head first.");
        }

        // End membership
        membership.setEndDate(LocalDate.now());
        membershipRepository.save(membership);

        // Update person's current household
        Person person = membership.getPerson();
        person.setCurrentHousehold(null);
        personRepository.save(person);

        // TODO: Create household event
    }

    @Transactional
    public HouseholdMembershipDTO updateMember(Integer householdId, Integer membershipId,
                                               HouseholdMembershipUpdateDTO dto) {
        HouseholdMembership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found with id: " + membershipId));

        if (!membership.getHousehold().getId().equals(householdId)) {
            throw new BusinessException("Membership does not belong to this household");
        }

        householdMapper.updateMembershipFromDTO(dto, membership);
        HouseholdMembership updated = membershipRepository.save(membership);

        return householdMapper.toMembershipDTO(updated);
    }

    public List<HouseholdMemberDTO> getHouseholdMembers(Integer householdId) {
        if (!householdRepository.existsById(householdId)) {
            throw new ResourceNotFoundException("Household not found with id: " + householdId);
        }

        List<HouseholdMembership> memberships = membershipRepository.findActiveByHouseholdId(householdId);
        return memberships.stream()
                .map(householdMapper::toMemberDTO)
                .collect(Collectors.toList());
    }

    public Page<HouseholdDTO> searchHouseholds(String code, String address, Integer wardId,
                                               String headName, Pageable pageable) {
        Specification<Household> spec = Specification.where(null);

        if (code != null && !code.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("code")), "%" + code.toLowerCase() + "%"));
        }

        if (address != null && !address.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("houseAddressDetails")), "%" + address.toLowerCase() + "%"));
        }

        if (wardId != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("ward").get("id"), wardId));
        }

        if (headName != null && !headName.isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                assert query != null;
                var subquery = query.subquery(Integer.class);
                var membership = subquery.from(HouseholdMembership.class);
                subquery.select(membership.get("household").get("id"))
                        .where(
                                cb.and(
                                        cb.equal(membership.get("household").get("id"), root.get("id")),
                                        cb.isTrue(membership.get("isHouseholdHead")),
                                        cb.isNull(membership.get("endDate")),
                                        cb.like(cb.lower(membership.get("person").get("fullName")),
                                                "%" + headName.toLowerCase() + "%")
                                )
                        );
                return cb.in(root.get("id")).value(subquery);
            });
        }

        return householdRepository.findAll(spec, pageable)
                .map(householdMapper::toDTO);
    }
}