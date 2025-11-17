package com.soict.service;

import com.soict.dto.household.*;
import com.soict.entity.household.*;
import com.soict.entity.household.event.HouseholdAddressChange;
import com.soict.entity.household.event.HouseholdHeadChange;
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
        if (dto.getChangeDate() == null) throw new BusinessException("changeDate is required");

        Household household = householdRepository.findById(dto.getHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + dto.getHouseholdId()));

        Integer fromWardId = dto.getFromAddressWardId();
        if (fromWardId == null) {
            if (household.getWard() == null) {
                throw new BusinessException("Household has no ward; cannot derive fromAddressWard");
            }
            fromWardId = household.getWard().getId();
        }

        final Integer fromWardIdFinal = fromWardId;
        Ward fromWard = wardRepository.findById(fromWardIdFinal)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "From Ward not found with id: " + fromWardIdFinal));

        final Integer toWardIdFinal = dto.getToAddressWardId();
        Ward toWard = wardRepository.findById(toWardIdFinal)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "To Ward not found with id: " + toWardIdFinal));

        household.setWardId(toWardIdFinal);
        household.setWard(toWard);
        household.setUpdatedAt(java.time.LocalDateTime.now());
        householdRepository.save(household);

        HouseholdAddressChange entity = addressChangeMapper.toEntity(dto);
        entity.setHousehold(household);
        entity.setFromAddressWard(fromWard);
        entity.setToAddressWard(toWard);

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
        if (dto.getChangeDate() == null) throw new BusinessException("changeDate is required");

        var household = householdRepository.findById(dto.getHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + dto.getHouseholdId()));

        com.soict.entity.person.Person fromPerson;
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
    public com.soict.dto.household.HouseholdSplitDTO createHouseholdSplit(
            com.soict.dto.household.HouseholdSplitCreateDTO dto
    ) {
        if (dto == null) throw new BusinessException("Payload is required");
        if (dto.getFromHouseholdId() == null) throw new BusinessException("fromHouseholdId is required");
        if (dto.getSplitDate() == null) throw new BusinessException("splitDate is required");
        if (dto.getMembers() == null || dto.getMembers().isEmpty()) {
            throw new BusinessException("members must not be empty");
        }

        var from = householdRepository.findById(dto.getFromHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException("From household not found: " + dto.getFromHouseholdId()));

        com.soict.entity.household.Household to;
        if (dto.getToHouseholdId() != null) {
            to = householdRepository.findById(dto.getToHouseholdId())
                    .orElseThrow(() -> new ResourceNotFoundException("To household not found: " + dto.getToHouseholdId()));
        } else {
            if (dto.getNewHouseholdCode() == null || dto.getNewHouseholdCode().isBlank()) {
                throw new BusinessException("newHouseholdCode is required when toHouseholdId is null");
            }
            if (householdRepository.existsByCode(dto.getNewHouseholdCode())) {
                throw new BusinessException("Household code already exists: " + dto.getNewHouseholdCode());
            }
            to = new com.soict.entity.household.Household();
            to.setCode(dto.getNewHouseholdCode().trim());
            to.setWard(from.getWard());
            to.setWardId(from.getWard() != null ? from.getWard().getId() : null);
            to.setHouseAddressDetails(from.getHouseAddressDetails());
            to = householdRepository.save(to);
        }

        long headCount = dto.getMembers().stream().filter(m -> java.lang.Boolean.TRUE.equals(m.getIsHead())).count();
        if (headCount != 1) {
            throw new BusinessException("Exactly one member must be marked as head for the new household");
        }

        java.time.LocalDate splitDate = dto.getSplitDate();
        java.util.List<com.soict.entity.person.Person> persons = new java.util.ArrayList<>();
        java.util.List<com.soict.entity.household.HouseholdMembership> fromMemberships = new java.util.ArrayList<>();

        for (com.soict.dto.household.HouseholdSplitMemberCreateDTO m : dto.getMembers()) {
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
            if (mem.getStartDate() != null && splitDate.isBefore(mem.getStartDate())) {
                throw new BusinessException("splitDate must be >= membership start date for person " + p.getId());
            }
            persons.add(p);
            fromMemberships.add(mem);
        }

        var split = new com.soict.entity.household.event.HouseholdSplit();
        split.setFromHousehold(from);
        split.setToHousehold(to);
        split.setSplitDate(splitDate);
        split.setNote(dto.getNote());
        split = householdSplitRepository.save(split);

        java.util.List<com.soict.entity.household.event.HouseholdSplitMember> splitMembers = new java.util.ArrayList<>();
        for (int i = 0; i < persons.size(); i++) {
            var p = persons.get(i);
            var oldMem = fromMemberships.get(i);

            oldMem.setEndDate(splitDate);
            membershipRepository.save(oldMem);

            var newMem = new com.soict.entity.household.HouseholdMembership();
            newMem.setHousehold(to);
            newMem.setPerson(p);
            newMem.setStartDate(splitDate);
            newMem.setIsHouseholdHead(false);
            newMem.setRelationToHead("Thành viên");
            newMem.setPrevPermAddressWard(oldMem.getPrevPermAddressWard());
            newMem.setPrevPermAddressDetails(oldMem.getPrevPermAddressDetails());

            boolean isHead = java.lang.Boolean.TRUE.equals(dto.getMembers().get(i).getIsHead());
            if (isHead) {
                newMem.setIsHouseholdHead(true);
                newMem.setRelationToHead("Chủ hộ");
            }
            membershipRepository.save(newMem);

            p.setCurrentHousehold(to);
            p.setCurrentHouseholdId(to.getId());
            p.setPermAddressWardId(to.getWardId());
            p.setPermAddressWard(to.getWard());
            p.setUpdatedAt(java.time.LocalDateTime.now());
            personRepository.save(p);

            var sm = new com.soict.entity.household.event.HouseholdSplitMember();
            sm.setHouseholdSplit(split);
            sm.setPerson(p);
            sm.setIsHead(isHead);
            splitMembers.add(sm);
        }
        householdSplitMemberRepository.saveAll(splitMembers);

        var out = householdSplitMapper.toDTO(split);
        var memberDTOs = splitMembers.stream()
                .map(householdSplitMemberMapper::toDTO)
                .collect(java.util.stream.Collectors.toList());
        out.setMembers(memberDTOs);
        return out;
    }

    public java.util.List<com.soict.dto.household.HouseholdSplitDTO> getAllHouseholdSplits() {
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

    public java.util.List<com.soict.dto.household.HouseholdSplitMemberDTO> getAllHouseholdSplitMembers() {
        return householdSplitMemberRepository.findAll(Sort.by(Sort.Direction.ASC, "id"))
                .stream()
                .map(householdSplitMemberMapper::toDTO)
                .toList();
    }

    public Page<com.soict.dto.household.HouseholdSplitDTO> getHouseholdSplitsPaginated(
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

        Specification<com.soict.entity.household.event.HouseholdSplit> spec =
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

    public Page<com.soict.dto.household.HouseholdSplitMemberDTO> getHouseholdSplitMembersPaginated(
            Pageable pageable,
            Integer splitId,
            String personName,
            String personIdNumber,
            Boolean isHead
    ) {
        Specification<com.soict.entity.household.event.HouseholdSplitMember> spec =
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

    public com.soict.dto.household.HouseholdSplitDTO getHouseholdSplitById(Integer id) {
        var s = householdSplitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household split not found: " + id));
        var dto = householdSplitMapper.toDTO(s);
        var members = householdSplitMemberRepository
                .findByHouseholdSplitIdOrderByIdAsc(s.getId())
                .stream().map(householdSplitMemberMapper::toDTO).toList();
        dto.setMembers(members);
        return dto;
    }

    public com.soict.dto.household.HouseholdSplitMemberDTO getHouseholdSplitMemberById(Integer id) {
        var sm = householdSplitMemberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household split member not found: " + id));
        return householdSplitMemberMapper.toDTO(sm);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteHouseholdSplit(Integer id) {
        var s = householdSplitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household split not found: " + id));
        householdSplitMemberRepository.deleteByHouseholdSplitId(s.getId());
        householdSplitRepository.delete(s);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteHouseholdSplitMember(Integer id) {
        if (!householdSplitMemberRepository.existsById(id)) {
            throw new ResourceNotFoundException("Household split member not found: " + id);
        }
        householdSplitMemberRepository.deleteById(id);
    }

}