package com.soict.service;

import com.soict.dto.household.*;
import com.soict.entity.household.*;
import com.soict.entity.household.event.HouseholdAddressChange;
import com.soict.entity.household.event.HouseholdHeadChange;
import com.soict.entity.household.event.HouseholdSplit;
import com.soict.entity.household.event.HouseholdSplitMember;
import com.soict.entity.location.Ward;
import com.soict.entity.person.Person;
import com.soict.exception.ResourceNotFoundException;
import com.soict.exception.BusinessException;
import com.soict.mapper.household.HouseholdMapper;
import com.soict.mapper.household.event.HouseholdAddressChangeMapper;
import com.soict.mapper.household.event.HouseholdHeadChangeMapper;
import com.soict.mapper.household.event.HouseholdSplitMapper;
import com.soict.mapper.household.event.HouseholdSplitMemberMapper;
import com.soict.repository.household.*;
import com.soict.repository.household.event.HouseholdAddressChangeRepository;
import com.soict.repository.household.event.HouseholdHeadChangeRepository;
import com.soict.repository.household.event.HouseholdSplitMemberRepository;
import com.soict.repository.household.event.HouseholdSplitRepository;
import com.soict.repository.location.WardRepository;
import com.soict.repository.person.PersonRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HouseholdService {

    private final HouseholdRepository householdRepository;
    private final HouseholdMembershipRepository membershipRepository;
    private final WardRepository wardRepository;
    private final PersonRepository personRepository;
    private final HouseholdMapper householdMapper;
    private final HouseholdAddressChangeRepository addressChangeRepository;
    private final HouseholdAddressChangeMapper addressChangeMapper;
    private final HouseholdHeadChangeRepository householdHeadChangeRepository;
    private final HouseholdHeadChangeMapper householdHeadChangeMapper;
    private final HouseholdSplitRepository householdSplitRepository;
    private final HouseholdSplitMemberRepository householdSplitMemberRepository;
    private final HouseholdSplitMapper householdSplitMapper;
    private final HouseholdSplitMemberMapper householdSplitMemberMapper;


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
        if (dto == null) throw new BusinessException("Payload is required");
        if (dto.getCode() == null || dto.getCode().isBlank()) {
            throw new BusinessException("Household code is required");
        }
        if (householdRepository.existsByCode(dto.getCode())) {
            throw new BusinessException("Household code already exists: " + dto.getCode());
        }
        if (dto.getWardId() == null) {
            throw new BusinessException("wardId is required");
        }

        Ward ward = wardRepository.findById(dto.getWardId())
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found: " + dto.getWardId()));

        Household household = householdMapper.toEntity(dto);
        household.setWard(ward);
        household.setWardId(ward.getId());

        Household saved = householdRepository.save(household);
        return householdMapper.toDTO(saved);
    }

    @Transactional
    public HouseholdDetailDTO initHousehold(HouseholdInitCreateDTO dto) {
        if (dto == null) throw new BusinessException("Payload is required");
        if (dto.getCode() == null || dto.getCode().isBlank()) {
            throw new BusinessException("Household code is required");
        }
        if (householdRepository.existsByCode(dto.getCode().trim())) {
            throw new BusinessException("Household code already exists: " + dto.getCode());
        }
        if (dto.getWardId() == null) {
            throw new BusinessException("wardId is required");
        }
        if (dto.getMembers() == null || dto.getMembers().isEmpty()) {
            throw new BusinessException("members must not be empty");
        }

        long headCount = dto.getMembers().stream()
                .filter(m -> Boolean.TRUE.equals(m.getIsHead()))
                .count();
        if (headCount != 1) {
            throw new BusinessException("Exactly one member must be marked as head for the household");
        }

        Ward ward = wardRepository.findById(dto.getWardId())
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found: " + dto.getWardId()));

        LocalDate baseStartDate = dto.getStartDate();
        if (baseStartDate == null) {
            baseStartDate = LocalDate.now();
        }

        Household household = new Household();
        household.setCode(dto.getCode().trim());
        household.setWard(ward);
        household.setWardId(ward.getId());
        household.setNotes(dto.getNote());
        household.setHouseAddressDetails(dto.getHouseAddressDetails());

        household = householdRepository.save(household);

        for (HouseholdInitMemberCreateDTO m : dto.getMembers()) {
            var person = personRepository.findById(m.getPersonId())
                    .orElseThrow(() -> new ResourceNotFoundException("Person not found: " + m.getPersonId()));

            var activeMemOpt = membershipRepository.findActiveByPersonId(person.getId());
            if (activeMemOpt.isPresent()) {
                throw new BusinessException("Person " + person.getId() + " already belongs to an active household");
            }

            LocalDate startDate = m.getStartDate() != null ? m.getStartDate() : baseStartDate;

            String relation = m.getRelationWithHead();
            if (relation == null || relation.isBlank()) {
                relation = Boolean.TRUE.equals(m.getIsHead()) ? "Chủ hộ" : "Thành viên";
            } else {
                relation = relation.trim();
            }

//            if ("Chủ hộ".equalsIgnoreCase(relation) && !Boolean.TRUE.equals(m.getIsHead())) {
//                throw new BusinessException("relationWithHead 'Chủ hộ' must be used only for the head member");
//            }

            HouseholdMembership membership = new HouseholdMembership();
            membership.setHousehold(household);
            membership.setPerson(person);
            membership.setStartDate(startDate);
            membership.setIsHouseholdHead(Boolean.TRUE.equals(m.getIsHead()));
            membership.setRelationToHead(relation);

            membership.setPrevPermAddressWard(person.getPermAddressWard());
            membership.setPrevPermAddressDetails(person.getPermAddressDetails());

            membershipRepository.save(membership);

            person.setCurrentHousehold(household);
            person.setCurrentHouseholdId(household.getId());
            person.setPermAddressWardId(household.getWardId());
            person.setPermAddressWard(household.getWard());
            person.setPermAddressDetails(household.getHouseAddressDetails());
            person.setUpdatedAt(java.time.LocalDateTime.now());
            personRepository.save(person);
        }

        return getHouseholdById(household.getId());
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

    @Transactional
    public HouseholdChangeDTO changeHousehold(HouseholdChangeCreateDTO dto) {
        if (dto == null) throw new BusinessException("Payload is required");
        if (dto.getToHouseholdId() == null) throw new BusinessException("toHouseholdId is required");
        if (dto.getPersonId() == null) throw new BusinessException("personId is required");

        LocalDate changeDate = dto.getChangeDate();
        if (changeDate == null) {
            changeDate = LocalDate.now();
        }

        String relationWithHead = dto.getRelationWithHead();
        if (relationWithHead == null) relationWithHead = "Thành viên";

        var person = personRepository.findById(dto.getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Person not found: " + dto.getPersonId()));

        var memOpt = membershipRepository.findActiveByPersonId(person.getId());
        if (memOpt.isEmpty()) {
            throw new BusinessException("Person has no active membership");
        }
        var oldMem = memOpt.get();
        var from = oldMem.getHousehold();
        Integer fromHouseholdId = from.getId();

        var to = householdRepository.findById(dto.getToHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "To household not found: " + dto.getToHouseholdId()
                ));

        if (fromHouseholdId.equals(to.getId())) {
            throw new BusinessException("Person already belongs to the target household");
        }

        if (Boolean.TRUE.equals(oldMem.getIsHouseholdHead())) {
            throw new BusinessException("Cannot transfer current household head. Change head first.");
        }

        oldMem.setEndDate(changeDate);
        membershipRepository.save(oldMem);

        var newMem = new HouseholdMembership();
        newMem.setHousehold(to);
        newMem.setPerson(person);
        newMem.setStartDate(changeDate);
        newMem.setIsHouseholdHead(false);
        newMem.setRelationToHead(relationWithHead);
        newMem.setPrevPermAddressWard(oldMem.getPrevPermAddressWard());
        newMem.setPrevPermAddressDetails(oldMem.getPrevPermAddressDetails());
        membershipRepository.save(newMem);

        person.setCurrentHousehold(to);
        person.setCurrentHouseholdId(to.getId());
        person.setPermAddressWardId(to.getWardId());
        person.setPermAddressWard(to.getWard());
        person.setPermAddressDetails(to.getHouseAddressDetails());
        person.setUpdatedAt(java.time.LocalDateTime.now());
        personRepository.save(person);

        return HouseholdChangeDTO.builder()
                .fromHouseholdId(fromHouseholdId)
                .toHouseholdId(to.getId())
                .personId(person.getId())
                .changeDate(changeDate)
                .relationWithHead(relationWithHead)
                .note(dto.getNote())
                .build();
    }

    public List<HouseholdAddressChangeDTO> getAllHouseholdAddressChanges() {
        return addressChangeRepository
                .findAll(Sort.by(Sort.Direction.DESC, "changeDate"))
                .stream()
                .map(addressChangeMapper::toDTO)
                .collect(Collectors.toList());
    }

    public HouseholdAddressChangeDTO getHouseholdAddressChangeById(Integer id) {
        HouseholdAddressChange entity = addressChangeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household address change not found with id: " + id));
        return addressChangeMapper.toDTO(entity);
    }

    public Page<HouseholdAddressChangeDTO> getHouseholdAddressChangesPaginated(
            Pageable pageable,
            String householdCode,
            Integer fromAddressWardId,
            Integer toAddressWardId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        Pageable sorted = pageable.getSort().isUnsorted()
                ? PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "changeDate"))
                : pageable;

        Specification<HouseholdAddressChange> spec = Specification.where(null);

        if (householdCode != null && !householdCode.isBlank()) {
            final String key = "%" + householdCode.trim().toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                Join<HouseholdAddressChange, Household> h = root.join("household", JoinType.INNER);
                return cb.like(cb.lower(h.get("code")), key);
            });
        }

        if (fromAddressWardId != null) {
            spec = spec.and((root, q, cb) ->
                    cb.equal(root.join("fromAddressWard", JoinType.INNER).get("id"), fromAddressWardId));
        }

        if (toAddressWardId != null) {
            spec = spec.and((root, q, cb) ->
                    cb.equal(root.join("toAddressWard", JoinType.INNER).get("id"), toAddressWardId));
        }

        if (startDate != null) {
            spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("changeDate"), startDate));
        }
        if (endDate != null) {
            spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("changeDate"), endDate));
        }

        return addressChangeRepository.findAll(spec, sorted)
                .map(addressChangeMapper::toDTO);
    }

    @Transactional
    public HouseholdAddressChangeDTO createHouseholdAddressChange(HouseholdAddressChangeCreateDTO dto) {
        if (dto == null) throw new BusinessException("Payload is required");
        if (dto.getHouseholdId() == null) throw new BusinessException("householdId is required");
        if (dto.getToAddressWardId() == null) throw new BusinessException("toAddressWardId is required");
        // if (dto.getChangeDate() == null) throw new BusinessException("changeDate is required");

        Household household = householdRepository.findById(dto.getHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + dto.getHouseholdId()));

        Integer fromWardId = dto.getFromAddressWardId();
        if (fromWardId == null) {
            fromWardId = household.getWard().getId();
        }
        HouseholdAddressChange entity = addressChangeMapper.toEntity(dto);

        String fromAddressDetails = dto.getFromAddressDetails();
        if (fromAddressDetails == null) fromAddressDetails = household.getHouseAddressDetails();

        if (fromWardId != null) {
            final Integer fromWardIdFinal = fromWardId;
            Ward fromWard = wardRepository.findById(fromWardIdFinal)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "From Ward not found with id: " + fromWardIdFinal));
            entity.setFromAddressWard(fromWard);
        }
        final Integer toWardIdFinal = dto.getToAddressWardId();
        Ward toWard = wardRepository.findById(toWardIdFinal)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "To Ward not found with id: " + toWardIdFinal));

        household.setWardId(toWardIdFinal);
        household.setWard(toWard);
        household.setHouseAddressDetails(dto.getToAddressDetails());
        household.setUpdatedAt(java.time.LocalDateTime.now());
        householdRepository.save(household);

        entity.setHousehold(household);
        entity.setToAddressWard(toWard);
        entity.setFromAddressDetails(fromAddressDetails);
        entity.setToAddressDetails(dto.getToAddressDetails());
        if (dto.getChangeDate() == null) {
            entity.setChangeDate(LocalDate.now());
        } else {
            entity.setChangeDate(dto.getChangeDate());
        }
        HouseholdAddressChange saved = addressChangeRepository.save(entity);
        return addressChangeMapper.toDTO(saved);
    }

    @Transactional
    public void deleteHouseholdAddressChange(Integer id) {
        if (!addressChangeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Household address change not found with id: " + id);
        }
        addressChangeRepository.deleteById(id);
    }

    @Transactional
    public HouseholdHeadChangeDTO createHouseholdHeadChange(HouseholdHeadChangeCreateDTO dto) {
        if (dto == null) throw new BusinessException("Payload is required");
        if (dto.getHouseholdId() == null) throw new BusinessException("householdId is required");
        if (dto.getToPersonId() == null) throw new BusinessException("toPersonId is required");
        // if (dto.getChangeDate() == null) throw new BusinessException("changeDate is required");

        var household = householdRepository.findById(dto.getHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + dto.getHouseholdId()));

        Person fromPerson;
        if (dto.getFromPersonId() == null) {
            var activeHeadOpt = membershipRepository.findActiveHeadByHouseholdId(household.getId());
            if (activeHeadOpt.isEmpty()) {
                throw new BusinessException("Household has no active head to transfer from");
            }
            fromPerson = activeHeadOpt.get().getPerson();
        } else {
            fromPerson = personRepository.findById(dto.getFromPersonId())
                    .orElseThrow(() -> new ResourceNotFoundException("From person not found with id: " + dto.getFromPersonId()));
        }

        var toPerson = personRepository.findById(dto.getToPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("To person not found with id: " + dto.getToPersonId()));

        if (fromPerson.getId().equals(toPerson.getId())) {
            throw new BusinessException("fromPerson and toPerson must be different");
        }

        var fromMemOpt = membershipRepository.findActiveByPersonId(fromPerson.getId());
        if (fromMemOpt.isEmpty()) {
            throw new BusinessException("From person has no active membership");
        }
        var fromMem = fromMemOpt.get();
        if (!fromMem.getHousehold().getId().equals(household.getId())) {
            throw new BusinessException("From person does not belong to this household");
        }
        if (Boolean.FALSE.equals(fromMem.getIsHouseholdHead())) {
            throw new BusinessException("From person is not current household head");
        }

        var toMemOpt = membershipRepository.findActiveByPersonId(toPerson.getId());
        if (toMemOpt.isEmpty()) {
            throw new BusinessException("To person has no active membership");
        }
        var toMem = toMemOpt.get();
        if (!toMem.getHousehold().getId().equals(household.getId())) {
            throw new BusinessException("To person does not belong to this household");
        }
        if (Boolean.TRUE.equals(toMem.getIsHouseholdHead())) {
            throw new BusinessException("To person is already the head");
        }

        fromMem.setIsHouseholdHead(false);
        if ("Chủ hộ".equalsIgnoreCase(fromMem.getRelationToHead())) {
            fromMem.setRelationToHead("Thành viên");
        }
        toMem.setIsHouseholdHead(true);
        toMem.setRelationToHead("Chủ hộ");

        membershipRepository.save(fromMem);
        membershipRepository.save(toMem);

        var entity = householdHeadChangeMapper.toEntity(dto);
        entity.setHousehold(household);
        entity.setFromPerson(fromPerson);
        entity.setToPerson(toPerson);
        if (dto.getChangeDate() == null) {
            entity.setChangeDate(LocalDate.now());
        } else {
            entity.setChangeDate(dto.getChangeDate());
        }
        var saved = householdHeadChangeRepository.save(entity);
        return householdHeadChangeMapper.toDTO(saved);
    }


    @Transactional
    public void deleteHouseholdHeadChange(Integer id) {
        if (!householdHeadChangeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Household head change not found with id: " + id);
        }
        householdHeadChangeRepository.deleteById(id);
    }

    public HouseholdHeadChangeDTO getHouseholdHeadChangeById(Integer id) {
        var entity = householdHeadChangeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household head change not found with id: " + id));
        return householdHeadChangeMapper.toDTO(entity);
    }

    public java.util.List<HouseholdHeadChangeDTO> getAllHouseholdHeadChanges() {
        return householdHeadChangeRepository
                .findAll(Sort.by(Sort.Direction.DESC, "changeDate"))
                .stream()
                .map(householdHeadChangeMapper::toDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    public Page<HouseholdHeadChangeDTO> getHouseholdHeadChangesPaginated(
            Pageable pageable,
            String householdCode,
            Integer fromPersonId,
            Integer toPersonId,
            java.time.LocalDate startDate,
            java.time.LocalDate endDate
    ) {
        var sorted = pageable.getSort().isUnsorted()
                ? PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "changeDate"))
                : pageable;

        Specification<HouseholdHeadChange> spec = Specification.where(null);

        if (householdCode != null && !householdCode.isBlank()) {
            final String key = "%" + householdCode.trim().toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                var h = root.join("household", JoinType.INNER);
                return cb.like(cb.lower(h.get("code")), key);
            });
        }
        if (fromPersonId != null) {
            spec = spec.and((root, q, cb) ->
                    cb.equal(root.join("fromPerson", JoinType.INNER).get("id"), fromPersonId));
        }
        if (toPersonId != null) {
            spec = spec.and((root, q, cb) ->
                    cb.equal(root.join("toPerson", JoinType.INNER).get("id"), toPersonId));
        }
        if (startDate != null) {
            spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("changeDate"), startDate));
        }
        if (endDate != null) {
            spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("changeDate"), endDate));
        }

        return householdHeadChangeRepository.findAll(spec, sorted)
                .map(householdHeadChangeMapper::toDTO);
    }

    @Transactional
    public HouseholdSplitDTO createHouseholdSplit(HouseholdSplitCreateDTO dto) {
        if (dto == null) throw new BusinessException("Payload is required");
        if (dto.getFromHouseholdId() == null) throw new BusinessException("fromHouseholdId is required");
        if (dto.getMembers() == null || dto.getMembers().isEmpty()) {
            throw new BusinessException("members must not be empty");
        }

        if (dto.getNewHouseholdCode() == null || dto.getNewHouseholdCode().isBlank()) {
            throw new BusinessException("newHouseholdCode is required");
        }

        LocalDate splitDate = dto.getSplitDate();
        if (splitDate == null) {
            splitDate = LocalDate.now();
        }

        var from = householdRepository.findById(dto.getFromHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "From household not found: " + dto.getFromHouseholdId()
                ));

        if (householdRepository.existsByCode(dto.getNewHouseholdCode())) {
            throw new BusinessException("Household code already exists: " + dto.getNewHouseholdCode());
        }

        Household to = new Household();
        to.setCode(dto.getNewHouseholdCode().trim());
        to.setWard(from.getWard());
        to.setWardId(from.getWard() != null ? from.getWard().getId() : null);
        to.setHouseAddressDetails(from.getHouseAddressDetails());
        to = householdRepository.save(to);

        long headCount = dto.getMembers().stream()
                .filter(m -> Boolean.TRUE.equals(m.getIsHead()))
                .count();
        if (headCount != 1) {
            throw new BusinessException("Exactly one member must be marked as head for the new household");
        }

        List<Person> persons = new ArrayList<>();
        List<HouseholdMembership> fromMemberships = new ArrayList<>();

        for (HouseholdSplitMemberCreateDTO m : dto.getMembers()) {
            var p = personRepository.findById(m.getPersonId())
                    .orElseThrow(() -> new ResourceNotFoundException("Person not found: " + m.getPersonId()));
            var memOpt = membershipRepository.findActiveByPersonId(p.getId());
            if (memOpt.isEmpty()) {
                throw new BusinessException("Person " + p.getId() + " has no active membership");
            }
            var mem = memOpt.get();
            if (!mem.getHousehold().getId().equals(from.getId())) {
                throw new BusinessException("Person " + p.getId() + " does not belong to fromHousehold");
            }
            persons.add(p);
            fromMemberships.add(mem);
        }

        var split = new HouseholdSplit();
        split.setFromHousehold(from);
        split.setToHousehold(to);
        split.setSplitDate(splitDate);
        split.setNote(dto.getNote());
        split = householdSplitRepository.save(split);

        List<HouseholdSplitMember> splitMembers = new ArrayList<>();
        
        // IMPORTANT: Close old memberships FIRST before creating new ones
        for (int i = 0; i < persons.size(); i++) {
            var oldMem = fromMemberships.get(i);
            oldMem.setEndDate(splitDate);
            membershipRepository.save(oldMem);
        }
        
        // Flush to ensure old memberships are closed in database
        membershipRepository.flush();

        // Now create new memberships
        for (int i = 0; i < persons.size(); i++) {
            var p = persons.get(i);
            var oldMem = fromMemberships.get(i);

            var newMem = new HouseholdMembership();
            newMem.setHousehold(to);
            newMem.setPerson(p);
            newMem.setStartDate(splitDate);
            newMem.setIsHouseholdHead(false);
            newMem.setRelationToHead("Thành viên");
            newMem.setPrevPermAddressWard(oldMem.getPrevPermAddressWard());
            newMem.setPrevPermAddressDetails(oldMem.getPrevPermAddressDetails());

            boolean isHead = Boolean.TRUE.equals(dto.getMembers().get(i).getIsHead());
            if (isHead) {
                newMem.setIsHouseholdHead(true);
                newMem.setRelationToHead("Chủ hộ");
            }
            membershipRepository.save(newMem);

            p.setCurrentHousehold(to);
            p.setCurrentHouseholdId(to.getId());
            p.setPermAddressWardId(to.getWardId());
            p.setPermAddressWard(to.getWard());
            p.setUpdatedAt(LocalDateTime.now());
            p.setPermAddressDetails(to.getHouseAddressDetails());
            personRepository.save(p);

            var sm = new HouseholdSplitMember();
            sm.setHouseholdSplit(split);
            sm.setPerson(p);
            sm.setIsHead(isHead);
            splitMembers.add(sm);
        }

        householdSplitMemberRepository.saveAll(splitMembers);

        var out = householdSplitMapper.toDTO(split);
        var memberDTOs = splitMembers.stream()
                .map(householdSplitMemberMapper::toDTO)
                .collect(Collectors.toList());
        out.setMembers(memberDTOs);
        return out;
    }


    public List<com.soict.dto.household.HouseholdSplitDTO> getAllHouseholdSplits() {
        return householdSplitRepository.findAll(Sort.by(Sort.Direction.DESC, "splitDate"))
                .stream()
                .map(s -> {
                    var dto = householdSplitMapper.toDTO(s);
                    var members = householdSplitMemberRepository
                            .findByHouseholdSplitIdOrderByIdAsc(s.getId())
                            .stream().map(householdSplitMemberMapper::toDTO).toList();
                    dto.setMembers(members);
                    return dto;
                })
                .toList();
    }

    public List<com.soict.dto.household.HouseholdSplitMemberDTO> getAllHouseholdSplitMembers() {
        return householdSplitMemberRepository.findAll(Sort.by(Sort.Direction.ASC, "id"))
                .stream()
                .map(householdSplitMemberMapper::toDTO)
                .toList();
    }

    public Page<HouseholdSplitDTO> getHouseholdSplitsPaginated(
            Pageable pageable,
            String fromHouseholdCode,
            String toHouseholdCode,
            LocalDate startDate,
            LocalDate endDate
    ) {
        Pageable sorted = pageable.getSort().isUnsorted()
                ? PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "splitDate"))
                : pageable;

        Specification<HouseholdSplit> spec =
                Specification.where(null);

        if (fromHouseholdCode != null && !fromHouseholdCode.isBlank()) {
            final String key = "%" + fromHouseholdCode.trim().toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                var fh = root.join("fromHousehold", JoinType.INNER);
                return cb.like(cb.lower(fh.get("code")), key);
            });
        }
        if (toHouseholdCode != null && !toHouseholdCode.isBlank()) {
            final String key = "%" + toHouseholdCode.trim().toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                var th = root.join("toHousehold", JoinType.INNER);
                return cb.like(cb.lower(th.get("code")), key);
            });
        }
        if (startDate != null) {
            spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("splitDate"), startDate));
        }
        if (endDate != null) {
            spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("splitDate"), endDate));
        }

        Page<com.soict.entity.household.event.HouseholdSplit> page = householdSplitRepository.findAll(spec, sorted);
        return page.map(s -> {
            var dto = householdSplitMapper.toDTO(s);
            var members = householdSplitMemberRepository
                    .findByHouseholdSplitIdOrderByIdAsc(s.getId())
                    .stream().map(householdSplitMemberMapper::toDTO).toList();
            dto.setMembers(members);
            return dto;
        });
    }

    public Page<HouseholdSplitMemberDTO> getHouseholdSplitMembersPaginated(
            Pageable pageable,
            Integer splitId,
            String personName,
            String personIdNumber,
            Boolean isHead
    ) {
        Specification<HouseholdSplitMember> spec =
                Specification.where(null);

        if (splitId != null) {
            spec = spec.and((root, q, cb) ->
                    cb.equal(root.join("householdSplit", JoinType.INNER).get("id"), splitId));
        }
        if (isHead != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("isHead"), isHead));
        }
        if (personName != null && !personName.isBlank()) {
            final String key = "%" + personName.trim().toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                var p = root.join("person", JoinType.INNER);
                return cb.like(cb.lower(p.get("fullName")), key);
            });
        }
        if (personIdNumber != null && !personIdNumber.isBlank()) {
            final String key = "%" + personIdNumber.trim().toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                var p = root.join("person", JoinType.INNER);
                return cb.like(cb.lower(p.get("idNumber")), key);
            });
        }

        Pageable sorted = pageable.getSort().isUnsorted()
                ? PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.ASC, "id"))
                : pageable;

        return householdSplitMemberRepository.findAll(spec, sorted)
                .map(householdSplitMemberMapper::toDTO);
    }

    public HouseholdSplitDTO getHouseholdSplitById(Integer id) {
        var s = householdSplitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household split not found: " + id));
        var dto = householdSplitMapper.toDTO(s);
        var members = householdSplitMemberRepository
                .findByHouseholdSplitIdOrderByIdAsc(s.getId())
                .stream().map(householdSplitMemberMapper::toDTO).toList();
        dto.setMembers(members);
        return dto;
    }

    public HouseholdSplitMemberDTO getHouseholdSplitMemberById(Integer id) {
        var sm = householdSplitMemberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household split member not found: " + id));
        return householdSplitMemberMapper.toDTO(sm);
    }

    @Transactional
    public void deleteHouseholdSplit(Integer id) {
        var s = householdSplitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household split not found: " + id));
        householdSplitMemberRepository.deleteByHouseholdSplitId(s.getId());
        householdSplitRepository.delete(s);
    }

    @Transactional
    public void deleteHouseholdSplitMember(Integer id) {
        if (!householdSplitMemberRepository.existsById(id)) {
            throw new ResourceNotFoundException("Household split member not found: " + id);
        }
        householdSplitMemberRepository.deleteById(id);
    }

    public List<HouseholdMembershipDTO> getAllMembershipsByHouseholdId(Integer householdId) {
        if (!householdRepository.existsById(householdId)) {
            throw new ResourceNotFoundException("Household not found with id: " + householdId);
        }

        Specification<HouseholdMembership> spec = (root, query, cb) ->
                cb.equal(root.get("household").get("id"), householdId);

        return membershipRepository.findAll(spec)
                .stream()
                .map(householdMapper::toMembershipDTO)
                .collect(Collectors.toList());
    }

    public Page<HouseholdMembershipDTO> getAllMembershipsByHouseholdIdPaginated(Integer householdId, Pageable pageable) {
        if (!householdRepository.existsById(householdId)) {
            throw new ResourceNotFoundException("Household not found with id: " + householdId);
        }

        Specification<HouseholdMembership> spec = (root, query, cb) ->
                cb.equal(root.get("household").get("id"), householdId);

        return membershipRepository.findAll(spec, pageable)
                .map(householdMapper::toMembershipDTO);
    }

}