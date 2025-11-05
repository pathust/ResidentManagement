package com.soict.service;

import com.soict.dto.person.*;
import com.soict.dto.person.event.BirthDeclareRequest;
import com.soict.entity.household.Household;
import com.soict.entity.location.Ward;
import com.soict.entity.person.*;
import com.soict.entity.person.event.*;
import com.soict.exception.ResourceNotFoundException;
import com.soict.exception.BusinessException;
import com.soict.mapper.person.event.BirthDeclareMapper;
import com.soict.mapper.person.event.DeathDeclareMapper;
import com.soict.mapper.person.event.TemporaryResidenceMapper;
import com.soict.mapper.person.event.TemporaryAbsenceMapper;
import com.soict.mapper.person.event.PermanentResidenceChangeMapper;
import com.soict.mapper.person.PersonMapper;
import com.soict.repository.location.WardRepository;
import com.soict.repository.person.*;
import com.soict.repository.household.HouseholdRepository;
import com.soict.repository.household.HouseholdMembershipRepository;
import com.soict.repository.person.event.*;
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
import java.time.chrono.ChronoLocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PersonService {
    private final PersonRepository personRepository;
    private final HouseholdRepository householdRepository;
    private final HouseholdMembershipRepository householdMembershipRepository;
    private final PersonMapper personMapper;
    private final BirthDeclareMapper birthDeclareMapper;
    private final DeathDeclareMapper deathDeclareMapper;
    private final TemporaryResidenceMapper temporaryResidenceMapper;
    private final TemporaryAbsenceMapper temporaryAbsenceMapper;
    private final PermanentResidenceChangeMapper permanentResidenceChangeMapper;
    private final PersonBirthDeclareRepository personBirthDeclareRepository;
    private final PersonDeathDeclareRepository personDeathDeclareRepository;
    private final PersonEventRepository personEventRepository;
    private final PersonPermanentResidenceChangeRepository personPermanentResidenceChangeRepository;
    private final PersonTemporaryResidenceRepository personTemporaryResidenceRepository;
    private final PersonTemporaryAbsenceRepository personTemporaryAbsenceRepository;
    private final WardRepository wardRepository;


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

    // ============ BIRTH DECLARE USE-CASES ===============
    @Transactional
    public BirthDeclareDTO createBirthDeclare(BirthDeclareRequest req) {
        if (req == null || req.getBirthDeclareCreate() == null) {
            throw new BusinessException("Birth declare payload is required");
        }
        var bdReq = req.getBirthDeclareCreate();
        if (bdReq.getDeclarerId() == null) {
            throw new BusinessException("Declarer is required");
        }
        if (bdReq.getDateOfDeclaration() == null) {
            throw new BusinessException("Date of declaration is required");
        }
        if (bdReq.getRelationWithDeclarer() == null || bdReq.getRelationWithDeclarer().isBlank()) {
            throw new BusinessException("Relation with declarer is required");
        }

        Person child;
        if (req.getPersonId() != null) {
            child = personRepository.findById(req.getPersonId())
                    .orElseThrow(() -> new ResourceNotFoundException("Person not found with id: " + req.getPersonId()));
        } else {
            PersonCreateDTO pc = req.getPersonCreate();
            if (pc == null) {
                throw new BusinessException("Either personId or personCreate is required");
            }

            if (pc.getFullName() == null || pc.getFullName().isBlank()) {
                throw new BusinessException("Full name is required to create a new person");
            }

            if (pc.getGender() == null) {
                throw new BusinessException("Gender is required to create a new person");
            }

            if (pc.getIdNumber() != null && !pc.getIdNumber().isBlank()
                    && personRepository.existsByIdNumber(pc.getIdNumber())) {
                throw new BusinessException("ID number already exists: " + pc.getIdNumber());
            }
            child = personRepository.save(personMapper.toEntity(pc));
        }

        if (child.getDateOfBirth() != null
                && bdReq.getDateOfDeclaration().isBefore(child.getDateOfBirth())) {
            throw new BusinessException("Declaration date must be after child's date of birth");
        }

        Person declarer = personRepository.findById(bdReq.getDeclarerId())
                .orElseThrow(() -> new ResourceNotFoundException("Declarer not found with id: " + bdReq.getDeclarerId()));

        if (declarer.getStatus() == Person.PersonStatus.DEAD) {
            throw new BusinessException("A deceased person cannot declare a birth.");
        }

        Person father = null;
        if (bdReq.getFatherId() != null) {
            father = personRepository.findById(bdReq.getFatherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Father not found with id: " + bdReq.getFatherId()));
        }

        Person mother = null;
        if (bdReq.getMotherId() != null) {
            mother = personRepository.findById(bdReq.getMotherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Mother not found with id: " + bdReq.getMotherId()));
        }

        BirthDeclare bd = new BirthDeclare();
        bd.setPerson(child);
        bd.setDeclarer(declarer);
        bd.setFather(father);
        bd.setMother(mother);

        bd.setDateOfBirth(child.getDateOfBirth());
        bd.setDateOfDeclaration(bdReq.getDateOfDeclaration());
        bd.setPlaceOfBirth(bdReq.getPlaceOfBirth());

        if (bdReq.getPlaceOfOriginWardId() != null) {
            Ward w = new Ward();
            w.setId(bdReq.getPlaceOfOriginWardId());
            bd.setPlaceOfOriginWard(w);
        }
        bd.setPlaceOfOriginDetails(bdReq.getPlaceOfOriginDetails());

        bd.setRelationWithDeclarer(bdReq.getRelationWithDeclarer());
        bd.setNote(bdReq.getNote());

        BirthDeclare saved = personBirthDeclareRepository.save(bd);
        return birthDeclareMapper.toDTO(saved);
    }

    @Transactional
    public void deleteBirthDeclare(Integer declareId) {
        if (!personBirthDeclareRepository.existsById(declareId)) {
            throw new ResourceNotFoundException("Birth declare not found: " + declareId);
        }
        personBirthDeclareRepository.deleteById(declareId);
    }

    public List<BirthDeclareDTO> getAllBirthDeclares() {
        return personBirthDeclareRepository
                .findAll(Sort.by(Sort.Direction.DESC, "dateOfDeclaration"))
                .stream()
                .map(birthDeclareMapper::toDTO)
                .collect(Collectors.toList());
    }

    public BirthDeclareDTO getBirthDeclareById(Integer id) {
        BirthDeclare bd = personBirthDeclareRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Birth declare not found with id: " + id));
        return birthDeclareMapper.toDTO(bd);
    }

    public Page<BirthDeclareDTO> getBirthDeclaresPaginated(
            Pageable pageable, String name, String idNumber, String declarerName,
            String declarerIdNumber, LocalDate startDate, LocalDate endDate, Integer wardId) {
        Pageable sorted = pageable.getSort().isUnsorted()
                ? PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "dateOfDeclaration"))
                : pageable;

        Specification<BirthDeclare> spec = Specification.where(null);

        if (name != null && !name.isBlank()) {
            final String s = "%" + name.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                Join<BirthDeclare, Person> p = root.join("person", JoinType.INNER);
                return cb.like(cb.lower(p.get("fullName")), s);
            });
        }

        if (idNumber != null && !idNumber.isBlank()) {
            final String s = "%" + idNumber.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                Join<BirthDeclare, Person> p = root.join("person", JoinType.INNER);
                return cb.like(cb.lower(p.get("idNumber")), s);
            });
        }

        if (declarerName != null && !declarerName.isBlank()) {
            final String s = "%" + declarerName.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                Join<BirthDeclare, Person> d = root.join("declarer", JoinType.INNER);
                return cb.like(cb.lower(d.get("fullName")), s);
            });
        }

        if (declarerIdNumber != null && !declarerIdNumber.isBlank()) {
            final String s = "%" + declarerIdNumber.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                Join<BirthDeclare, Person> d = root.join("declarer", JoinType.INNER);
                return cb.like(cb.lower(d.get("idNumber")), s);
            });
        }

        if (startDate != null) {
            spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("dateOfDeclaration"), startDate));
        }
        if (endDate != null) {
            spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("dateOfDeclaration"), endDate));
        }

        if (wardId != null) {
            spec = spec.and((root, q, cb) -> {
                var w = root.join("placeOfOriginWard", JoinType.LEFT);
                return cb.equal(w.get("id"), wardId);
            });
        }

        return personBirthDeclareRepository.findAll(spec, sorted)
                .map(birthDeclareMapper::toDTO);
    }

    // ============ DEATH DECLARE USE-CASES ===============
    @Transactional
    public DeathDeclareDTO createDeathDeclare(DeathDeclareCreateDTO dto) {
        if (dto == null) {
            throw new BusinessException("Payload is required");
        }
        if (dto.getPersonId() == null && (dto.getIdNumber() == null || dto.getIdNumber().isBlank())) {
            throw new BusinessException("Either person ID or ID number is required");
        }
        if (dto.getDeclarerId() == null) {
            throw new BusinessException("Declarer ID is required");
        }
        if (dto.getDateOfDeclaration() == null) {
            throw new BusinessException("Date of declaration is required");
        }
        if (dto.getLastPermanentResidenceWardId() == null) {
            throw new BusinessException("Last permanent residence ward is required");
        }
        if (dto.getDateOfDeclaration().isBefore(ChronoLocalDate.from(dto.getTimeOfDeath()))) {
            throw new BusinessException("Declaration date must be >= date of death");
        }
        Person person;
        if (dto.getPersonId() != null) {
            person = personRepository.findById(dto.getPersonId())
                    .orElseThrow(() -> new ResourceNotFoundException("Person not found with id: " + dto.getPersonId()));
        } else {
            person = personRepository.findPersonByIdNumber(dto.getIdNumber())
                    .orElseThrow(() -> new ResourceNotFoundException("Person not found with ID number: " + dto.getIdNumber()));
        }
        var existingDeclares = personDeathDeclareRepository.findByPersonIdOrderByDeclareDateDesc(person.getId());
        if (!existingDeclares.isEmpty()) {
            throw new BusinessException("This person already has a death declaration");
        }
        Person declarer = personRepository.findById(dto.getDeclarerId())
                .orElseThrow(() -> new ResourceNotFoundException("Declarer not found with id: " + dto.getDeclarerId()));

        if (declarer.getId().equals(person.getId())) {
            throw new BusinessException("Declarer cannot declare death for themselves.");
        }

        if (declarer.getStatus() == Person.PersonStatus.DEAD) {
            throw new BusinessException("A deceased person cannot be a declarer.");
        }

        DeathDeclare dd = new DeathDeclare();
        dd.setPerson(person);
        dd.setDeclarer(declarer);
        dd.setTimeOfDeath(dto.getTimeOfDeath());
        dd.setDateOfDeclaration(dto.getDateOfDeclaration());

        Integer wardId = dto.getLastPermanentResidenceWardId();
        if (wardId == null) {
            throw new BusinessException("Last permanent residence ward is required");
        }

        Ward ward = wardRepository.findById(wardId)
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found: " + wardId));
        dd.setLastPermanentResidenceWard(ward);
        dd.setNote(dto.getNote());
        dd.setLastPermanentResidenceDetails(dto.getLastPermanentResidenceDetails());

        DeathDeclare saved = personDeathDeclareRepository.save(dd);

        if (person.getStatus() != Person.PersonStatus.DEAD) {
            person.setStatus(Person.PersonStatus.DEAD);
            person.setUpdatedAt(java.time.LocalDateTime.now());
            personRepository.save(person);
        }

        householdMembershipRepository.findActiveByPersonId(person.getId()).ifPresent(m -> {
            m.setEndDate(LocalDate.from(dto.getTimeOfDeath()));
            householdMembershipRepository.save(m);
        });
        return deathDeclareMapper.toDTO(saved);
    }

    @Transactional
    public void deleteDeathDeclare(Integer declareId) {
        if (!personDeathDeclareRepository.existsById(declareId)) {
            throw new ResourceNotFoundException("Death declare not found: " + declareId);
        }
        personDeathDeclareRepository.deleteById(declareId);
    }

    public List<DeathDeclareDTO> getAllDeathDeclares() {
        return personDeathDeclareRepository
                .findAll(Sort.by(Sort.Direction.DESC, "dateOfDeclaration"))
                .stream()
                .map(deathDeclareMapper::toDTO)
                .collect(Collectors.toList());
    }

    public DeathDeclareDTO getDeathDeclareById(Integer id) {
        DeathDeclare dd = personDeathDeclareRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Death declare not found with id: " + id));
        return deathDeclareMapper.toDTO(dd);
    }

    public Page<DeathDeclareDTO> getDeathDeclaresPaginated(
            Pageable pageable, String name, String idNumber, String declarerName, String declarerIdNumber,
            LocalDate startDate, LocalDate endDate, Integer wardId
    ) {
        Pageable sorted = pageable.getSort().isUnsorted()
                ? PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "dateOfDeclaration"))
                : pageable;

        Specification<DeathDeclare> spec = Specification.where(null);

        if (name != null && !name.isBlank()) {
            final String s = "%" + name.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                Join<DeathDeclare, Person> p = root.join("person", JoinType.INNER);
                return cb.like(cb.lower(p.get("fullName")), s);
            });
        }

        if (idNumber != null && !idNumber.isBlank()) {
            final String s = "%" + idNumber.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                Join<DeathDeclare, Person> p = root.join("person", JoinType.INNER);
                return cb.like(cb.lower(p.get("idNumber")), s);
            });
        }

        if (declarerName != null && !declarerName.isBlank()) {
            final String s = "%" + declarerName.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                Join<DeathDeclare, Person> d = root.join("declarer", JoinType.INNER);
                return cb.like(cb.lower(d.get("fullName")), s);
            });
        }

        if (declarerIdNumber != null && !declarerIdNumber.isBlank()) {
            final String s = "%" + declarerIdNumber.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                Join<DeathDeclare, Person> d = root.join("declarer", JoinType.INNER);
                return cb.like(cb.lower(d.get("idNumber")), s);
            });
        }

        if (startDate != null) {
            spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("dateOfDeclaration"), startDate));
        }
        if (endDate != null) {
            spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("dateOfDeclaration"), endDate));
        }

        if (wardId != null) {
            spec = spec.and((root, q, cb) -> {
                var w = root.join("lastPermanentResidenceWard", JoinType.LEFT);
                return cb.equal(w.get("id"), wardId);
            });
        }

        return personDeathDeclareRepository.findAll(spec, sorted)
                .map(deathDeclareMapper::toDTO);
    }


    // ============ TEMPORARY RESIDENCE USE-CASES ===============
    public List<TemporaryResidenceDTO> getAllTemporaryResidences() {
        return personTemporaryResidenceRepository
                .findAll(Sort.by(Sort.Direction.DESC, "startDate"))
                .stream()
                .map(temporaryResidenceMapper::toDTO)
                .collect(Collectors.toList());
    }

    public TemporaryResidenceDTO getTemporaryResidenceById(Integer id) {
        TemporaryResidence tr = personTemporaryResidenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Temporary residence not found with id: " + id));
        return temporaryResidenceMapper.toDTO(tr);
    }

    @Transactional
    public TemporaryResidenceDTO createTemporaryResidence(TemporaryResidenceCreateDTO dto) {
        if (dto == null) throw new BusinessException("Payload is required");
        if (dto.getPersonId() == null) throw new BusinessException("personId is required");
        if (dto.getStartDate() == null) throw new BusinessException("startDate is required");
        if (dto.getTempAddressWardId() == null) throw new BusinessException("tempAddressWardId is required");

        if (dto.getEndDate() != null && dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new BusinessException("endDate must be >= startDate");
        }

        Person person = personRepository.findById(dto.getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with id: " + dto.getPersonId()));
        if (person.getStatus() == Person.PersonStatus.DEAD) {
            throw new BusinessException("Cannot create temporary residence for a deceased person");
        }

        Household currentHousehold = null;
        Integer hhId = dto.getCurrentHouseholdId();
        if (hhId != null) {
            currentHousehold = householdRepository.findById(hhId)
                    .orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + hhId));
        } else if (person.getCurrentHouseholdId() != null) {
            currentHousehold = householdRepository.findById(person.getCurrentHouseholdId())
                    .orElse(null);
        }

        Ward tempWard = wardRepository.findById(dto.getTempAddressWardId())
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found: " + dto.getTempAddressWardId()));

        TemporaryResidence tr = new TemporaryResidence();
        tr.setPerson(person);
        tr.setCurrentHousehold(currentHousehold);
        tr.setStartDate(dto.getStartDate());
        tr.setEndDate(dto.getEndDate());
        tr.setTempAddressWard(tempWard);
        tr.setTempAddressDetails(dto.getTempAddressDetails());
        tr.setDetails(dto.getDetails());

        person.setTempAddressWardId(tempWard.getId());   // cột int
        person.setTempAddressWard(tempWard);             // quan hệ ManyToOne (đã insertable=false, updatable=false -> setId là đủ)
        person.setTempAddressDetails(dto.getTempAddressDetails());
        person.setUpdatedAt(java.time.LocalDateTime.now());
        personRepository.save(person);

        TemporaryResidence saved = personTemporaryResidenceRepository.save(tr);
        return temporaryResidenceMapper.toDTO(saved);
    }

    @Transactional
    public void deleteTemporaryResidence(Integer id) {
        if (!personTemporaryResidenceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Temporary residence not found: " + id);
        }
        personTemporaryResidenceRepository.deleteById(id);
    }

    public Page<TemporaryResidenceDTO> getTemporaryResidencesPaginated(
            Pageable pageable, String name, String idNumber, String householdNumber,
            LocalDate startDate, LocalDate endDate, Integer wardId
    ) {
        Pageable sorted = pageable.getSort().isUnsorted()
                ? PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "startDate"))
                : pageable;

        Specification<TemporaryResidence> spec = Specification.where(null);

        if (name != null && !name.isBlank()) {
            final String s = "%" + name.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                Join<TemporaryResidence, Person> p = root.join("person", JoinType.INNER);
                return cb.like(cb.lower(p.get("fullName")), s);
            });
        }

        if (idNumber != null && !idNumber.isBlank()) {
            final String s = "%" + idNumber.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                Join<TemporaryResidence, Person> p = root.join("person", JoinType.INNER);
                return cb.like(cb.lower(p.get("idNumber")), s);
            });
        }

        if (householdNumber != null && !householdNumber.isBlank()) {
            final String s = householdNumber.toLowerCase();
            spec = spec.and((root, q, cb) -> {
                Join<TemporaryResidence, Household> ch = root.join("currentHousehold", JoinType.LEFT);
                return cb.equal(cb.lower(ch.get("code")), s);
            });
        }

        if (startDate != null || endDate != null) {
            LocalDate from = (startDate != null) ? startDate : LocalDate.MIN;
            LocalDate to   = (endDate   != null) ? endDate   : LocalDate.MAX;

            spec = spec.and((root, q, cb) -> cb.and(
                    cb.lessThanOrEqualTo(root.get("startDate"), to),
                    cb.or(
                            cb.isNull(root.get("endDate")),
                            cb.greaterThanOrEqualTo(root.get("endDate"), from)
                    )
            ));
        }

        if (wardId != null) {
            spec = spec.and((root, q, cb) -> {
                var w = root.join("tempAddressWard", JoinType.LEFT);
                return cb.equal(w.get("id"), wardId);
            });
        }

        return personTemporaryResidenceRepository.findAll(spec, sorted)
                .map(temporaryResidenceMapper::toDTO);
    }

    public TemporaryResidenceDTO endTemporaryResidence(Integer trId, TemporaryResidenceUpdateDTO dto) {
        if (dto == null || dto.getEndDate() == null) {
            throw new BusinessException("endDate is required");
        }

        TemporaryResidence tr = personTemporaryResidenceRepository.findById(trId)
                .orElseThrow(() -> new ResourceNotFoundException("Temporary residence not found: " + trId));

        if (dto.getEndDate().isBefore(tr.getStartDate())) {
            throw new BusinessException("endDate must be >= startDate");
        }
//        if (tr.getEndDate() != null && !dto.getEndDate().isBefore(tr.getEndDate())) {
//            throw new BusinessException("Temporary residence already ended earlier or at the same date.");
//        }

        tr.setEndDate(dto.getEndDate());
        if (dto.getDetails() != null) {
            tr.setDetails(dto.getDetails());
        }
        TemporaryResidence saved = personTemporaryResidenceRepository.save(tr);

        LocalDate today = LocalDate.now();

        Specification<TemporaryResidence> activeSpec = (root, q, cb) -> cb.and(
                cb.equal(root.join("person", JoinType.INNER).get("id"), tr.getPerson().getId()),
                cb.lessThanOrEqualTo(root.get("startDate"), today),
                cb.or(
                        cb.isNull(root.get("endDate")),
                        cb.greaterThanOrEqualTo(root.get("endDate"), today)
                )
        );

        Page<TemporaryResidence> active = personTemporaryResidenceRepository.findAll(
                activeSpec, PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "startDate"))
        );

        Person person = tr.getPerson();
        if (!active.isEmpty()) {
            TemporaryResidence latest = active.getContent().get(0);
            if (latest.getTempAddressWard() != null) {
                person.setTempAddressWardId(latest.getTempAddressWard().getId());
                person.setTempAddressWard(latest.getTempAddressWard());
            } else {
                person.setTempAddressWardId(null);
                person.setTempAddressWard(null);
            }
            person.setTempAddressDetails(latest.getTempAddressDetails());
        } else {
            person.setTempAddressWardId(null);
            person.setTempAddressWard(null);
            person.setTempAddressDetails(null);
        }
        person.setUpdatedAt(java.time.LocalDateTime.now());
        personRepository.save(person);

        return temporaryResidenceMapper.toDTO(saved);
    }

    // ============ TEMPORARY ABSENCE USE-CASES ===============
    @Transactional
    public TemporaryAbsenceDTO createTemporaryAbsence(TemporaryAbsenceCreateDTO dto) {
        if (dto == null) throw new BusinessException("Payload is required");
        if (dto.getPersonId() == null) throw new BusinessException("personId is required");
        if (dto.getStartDate() == null) throw new BusinessException("startDate is required");
        if (dto.getEndDate() != null && dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new BusinessException("endDate must be >= startDate");
        }

        Person person = personRepository.findById(dto.getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with id: " + dto.getPersonId()));
        if (person.getStatus() == Person.PersonStatus.DEAD) {
            throw new BusinessException("Cannot create temporary absence for a deceased person");
        }

        // --- Fallback currentHousehold ---
        Household currentHousehold = null;
        Integer hhId = dto.getCurrentHouseholdId() != null
                ? dto.getCurrentHouseholdId()
                : person.getCurrentHouseholdId();                 // lấy từ person nếu null
        if (hhId != null) {
            currentHousehold = householdRepository.findById(hhId)
                    .orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + hhId));
        } else {
            throw new BusinessException("Current household is required (not provided and person has none)");
        }

        // --- Fallback permAddressWard ---
        Integer permWardId = dto.getPermAddressWardId() != null
                ? dto.getPermAddressWardId()
                : person.getPermAddressWardId();                 // lấy từ person nếu null
        if (permWardId == null) {
            throw new BusinessException("Perm address ward is required (not provided and person has none)");
        }
        Ward permWard = wardRepository.findById(permWardId)
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found: " + permWardId));

        Ward tempWard = null;
        if (dto.getTempAddressWardId() != null) {
            tempWard = wardRepository.findById(dto.getTempAddressWardId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ward not found: " + dto.getTempAddressWardId()));
        }

        TemporaryAbsence ta = new TemporaryAbsence();
        ta.setPerson(person);
        ta.setCurrentHousehold(currentHousehold);
        ta.setStartDate(dto.getStartDate());
        ta.setEndDate(dto.getEndDate());
        ta.setDestination(dto.getDestination());
        ta.setReason(dto.getReason());
        ta.setPermAddressWard(permWard);
        ta.setPermAddressDetails(dto.getPermAddressDetails());
        ta.setTempAddressWard(tempWard);
        ta.setTempAddressDetails(dto.getTempAddressDetails());

        TemporaryAbsence saved = personTemporaryAbsenceRepository.save(ta);
        return temporaryAbsenceMapper.toDTO(saved);
    }


    @Transactional
    public void deleteTemporaryAbsence(Integer id) {
        if (!personTemporaryAbsenceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Temporary absence not found: " + id);
        }
        personTemporaryAbsenceRepository.deleteById(id);
    }

    public TemporaryAbsenceDTO getTemporaryAbsenceById(Integer id) {
        var ta = personTemporaryAbsenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Temporary absence not found: " + id));
        return temporaryAbsenceMapper.toDTO(ta);
    }

    public List<TemporaryAbsenceDTO> getAllTemporaryAbsences() {
        return personTemporaryAbsenceRepository
                .findAll(Sort.by(Sort.Direction.DESC, "startDate"))
                .stream()
                .map(temporaryAbsenceMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Page<TemporaryAbsenceDTO> getTemporaryAbsencesPaginated(
            Pageable pageable, String name, String idNumber, String householdNumber,
            Integer permAddressWardId, Integer tempAddressWardId, LocalDate startDate, LocalDate endDate
    ) {
        Pageable sorted = pageable.getSort().isUnsorted()
                ? PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "startDate"))
                : pageable;

        Specification<TemporaryAbsence> spec = Specification.where(null);

        if (name != null && !name.isBlank()) {
            final String s = "%" + name.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                Join<TemporaryAbsence, Person> p = root.join("person", JoinType.INNER);
                return cb.like(cb.lower(p.get("fullName")), s);
            });
        }

        if (idNumber != null && !idNumber.isBlank()) {
            final String s = "%" + idNumber.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                Join<TemporaryAbsence, Person> p = root.join("person", JoinType.INNER);
                return cb.like(cb.lower(p.get("idNumber")), s);
            });
        }

        if (householdNumber != null && !householdNumber.isBlank()) {
            final String s = householdNumber.toLowerCase();
            spec = spec.and((root, q, cb) -> {
                Join<TemporaryAbsence, Household> h = root.join("currentHousehold", JoinType.INNER);
                return cb.equal(cb.lower(h.get("code")), s);
            });
        }

        if (permAddressWardId != null) {
            spec = spec.and((root, q, cb) -> {
                Join<TemporaryAbsence, Ward> w = root.join("permAddressWard", JoinType.INNER);
                return cb.equal(w.get("id"), permAddressWardId);
            });
        }

        if (tempAddressWardId != null) {
            spec = spec.and((root, q, cb) -> {
                Join<TemporaryAbsence, Ward> w = root.join("tempAddressWard", JoinType.LEFT);
                return cb.equal(w.get("id"), tempAddressWardId);
            });
        }

        if (startDate != null) {
            spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("startDate"), startDate));
        }
        if (endDate != null) {
            spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("startDate"), endDate));
        }

        return personTemporaryAbsenceRepository.findAll(spec, sorted)
                .map(temporaryAbsenceMapper::toDTO);
    }

    @Transactional
    public TemporaryAbsenceDTO endTemporaryAbsence(Integer id, TemporaryAbsenceUpdateDTO body) {
        var ta = personTemporaryAbsenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Temporary absence not found: " + id));

        if (body.getEndDate() == null) {
            throw new BusinessException("endDate is required to end a temporary absence");
        }
        if (body.getEndDate().isBefore(ta.getStartDate())) {
            throw new BusinessException("endDate must be >= startDate");
        }

        if (body.getDestination() != null) ta.setDestination(body.getDestination());
        if (body.getReason() != null) ta.setReason(body.getReason());
        if (body.getPermAddressDetails() != null) ta.setPermAddressDetails(body.getPermAddressDetails());
        if (body.getTempAddressDetails() != null) ta.setTempAddressDetails(body.getTempAddressDetails());
        if (body.getTempAddressWardId() != null) {
            var w = wardRepository.findById(body.getTempAddressWardId())
                    .orElseThrow(() -> new ResourceNotFoundException("Temp ward not found: " + body.getTempAddressWardId()));
            ta.setTempAddressWard(w);
        }

        ta.setEndDate(body.getEndDate());
        var saved = personTemporaryAbsenceRepository.save(ta);
        return temporaryAbsenceMapper.toDTO(saved);
    }




    @Transactional
    public PermanentResidenceChangeDTO createPermanentResidenceChange(PermanentResidenceChangeCreateDTO dto) {
        if (dto == null) throw new BusinessException("Payload is required");
        if (dto.getPersonId() == null) throw new BusinessException("personId is required");
        if (dto.getAddressWardId() == null) throw new BusinessException("addressWardId is required");
        if (dto.getStartDate() == null) throw new BusinessException("startDate is required");

        Person person = personRepository.findById(dto.getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with id: " + dto.getPersonId()));
        if (person.getStatus() == Person.PersonStatus.DEAD) {
            throw new BusinessException("Cannot change permanent residence for a deceased person");
        }

        Household currentHousehold = null;
        if (dto.getCurrentHouseholdId() != null) {
            currentHousehold = householdRepository.findById(dto.getCurrentHouseholdId())
                    .orElseThrow(() -> new ResourceNotFoundException("Household not found: " + dto.getCurrentHouseholdId()));
        } else if (person.getCurrentHouseholdId() != null) {
            currentHousehold = householdRepository.findById(person.getCurrentHouseholdId()).orElse(null);
        }

        Ward newWard = wardRepository.findById(dto.getAddressWardId())
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found: " + dto.getAddressWardId()));

        Ward prevWard = null;
        if (dto.getPrevAddressWardId() != null) {
            prevWard = wardRepository.findById(dto.getPrevAddressWardId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ward not found: " + dto.getPrevAddressWardId()));
        } else if (person.getPermAddressWardId() != null) {
            prevWard = wardRepository.findById(person.getPermAddressWardId()).orElse(null);
        }

        PermanentResidenceChange prc = permanentResidenceChangeMapper.toEntity(dto);
        prc.setPerson(person);
        prc.setCurrentHousehold(currentHousehold);
        prc.setAddressWard(newWard);
        prc.setPrevAddressWard(prevWard);

        person.setPermAddressWardId(newWard.getId());
        person.setPermAddressWard(newWard);
        person.setPermAddressDetails(dto.getAddressDetails());
        person.setUpdatedAt(java.time.LocalDateTime.now());
        personRepository.save(person);

        PermanentResidenceChange saved = personPermanentResidenceChangeRepository.save(prc);
        return permanentResidenceChangeMapper.toDTO(saved);
    }

    @Transactional
    public void deletePermanentResidenceChange(Integer id) {
        if (!personPermanentResidenceChangeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Permanent residence change not found: " + id);
        }
        personPermanentResidenceChangeRepository.deleteById(id);
    }

    public PermanentResidenceChangeDTO getPermanentResidenceChangeById(Integer id) {
        PermanentResidenceChange prc = personPermanentResidenceChangeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permanent residence change not found: " + id));
        return permanentResidenceChangeMapper.toDTO(prc);
    }

    public Page<PermanentResidenceChangeDTO> getPermanentResidenceChangesPaginated(
            Pageable pageable, String name, String idNumber, String householdNumber,
            Integer prevAddressWardId, Integer addressWardId, LocalDate startDate, LocalDate endDate
    ) {
        Pageable sorted = pageable.getSort().isUnsorted()
                ? PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "startDate"))
                : pageable;

        Specification<PermanentResidenceChange> spec = Specification.where(null);

        if (name != null && !name.isBlank()) {
            final String key = "%" + name.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                Join<PermanentResidenceChange, Person> p = root.join("person", JoinType.INNER);
                return cb.like(cb.lower(p.get("fullName")), key);
            });
        }

        if (idNumber != null && !idNumber.isBlank()) {
            final String key = "%" + idNumber.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> {
                Join<PermanentResidenceChange, Person> p = root.join("person", JoinType.INNER);
                return cb.like(cb.lower(p.get("idNumber")), key);
            });
        }

        if (householdNumber != null && !householdNumber.isBlank()) {
            final String key = householdNumber.toLowerCase();
            spec = spec.and((root, q, cb) -> {
                Join<PermanentResidenceChange, Household> h = root.join("currentHousehold", JoinType.LEFT);
                return cb.equal(cb.lower(h.get("code")), key);
            });
        }

        if (prevAddressWardId != null) {
            spec = spec.and((root, q, cb) -> {
                var w = root.join("prevAddressWard", JoinType.LEFT);
                return cb.equal(w.get("id"), prevAddressWardId);
            });
        }

        if (addressWardId != null) {
            spec = spec.and((root, q, cb) -> {
                var w = root.join("addressWard", JoinType.LEFT);
                return cb.equal(w.get("id"), addressWardId);
            });
        }

        if (startDate != null) {
            spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("startDate"), startDate));
        }
        if (endDate != null) {
            spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("startDate"), endDate));
        }

        return personPermanentResidenceChangeRepository.findAll(spec, sorted)
                .map(permanentResidenceChangeMapper::toDTO);
    }

    public List<PermanentResidenceChangeDTO> getAllPermanentResidenceChanges() {
        return personPermanentResidenceChangeRepository
                .findAll(Sort.by(Sort.Direction.DESC, "startDate"))
                .stream()
                .map(permanentResidenceChangeMapper::toDTO)
                .collect(Collectors.toList());
    }
}