package com.soict.service;

import com.soict.dto.stats.AgeGroupStatsDTO;
import com.soict.dto.stats.GenderStatsDTO;
import com.soict.dto.stats.PersonOverviewStatsDTO;
import com.soict.dto.stats.WardPersonStatsDTO;
import com.soict.entity.person.Person;
import com.soict.entity.person.event.TemporaryAbsence;
import com.soict.entity.person.event.TemporaryResidence;
import com.soict.repository.person.PersonRepository;
import com.soict.repository.person.event.PersonTemporaryAbsenceRepository;
import com.soict.repository.person.event.PersonTemporaryResidenceRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatsService {

    private final PersonRepository personRepository;
    private final PersonTemporaryResidenceRepository personTemporaryResidenceRepository;
    private final PersonTemporaryAbsenceRepository personTemporaryAbsenceRepository;


    private Specification<Person> aliveSpec() {
        return (root, query, cb) ->
                cb.notEqual(root.get("status"), Person.PersonStatus.DEAD);
    }

    private Specification<Person> wardSpec(Integer wardId) {
        return (root, query, cb) ->
                cb.or(
                        cb.equal(root.get("permAddressWardId"), wardId),
                        cb.equal(root.get("currentHousehold").get("wardId"), wardId)
                );
    }

    private long countAliveByGender(String genderValue) {
        Specification<Person> spec = Specification.where(aliveSpec())
                .and((root, query, cb) -> cb.equal(root.get("gender"), genderValue));
        return personRepository.count(spec);
    }

    private AgeGroupStatsDTO countAlivePersonsByAgeGroup() {
        LocalDate today = LocalDate.now();
        LocalDate age18Cutoff = today.minusYears(18);
        LocalDate age60Cutoff = today.minusYears(60);

        Specification<Person> base = Specification.where(aliveSpec());

        long age0To17 = personRepository.count(
                base.and((root, query, cb) ->
                        cb.greaterThan(root.get("dateOfBirth"), age18Cutoff))
        );

        long age18To60 = personRepository.count(
                base.and((root, query, cb) ->
                        cb.and(
                                cb.lessThanOrEqualTo(root.get("dateOfBirth"), age18Cutoff),
                                cb.greaterThanOrEqualTo(root.get("dateOfBirth"), age60Cutoff)
                        ))
        );

        long ageOver60 = personRepository.count(
                base.and((root, query, cb) ->
                        cb.lessThan(root.get("dateOfBirth"), age60Cutoff))
        );

        return new AgeGroupStatsDTO(age0To17, age18To60, ageOver60);
    }

    public PersonOverviewStatsDTO getPersonOverviewStats() {
        long total = countAllPersons();
        long alive = countAlivePersons();

        long male = countAliveByGender("M");
        long female = countAliveByGender("F");
        GenderStatsDTO genderStats = new GenderStatsDTO(male, female);

        AgeGroupStatsDTO ageGroupStats = countAlivePersonsByAgeGroup();

        return new PersonOverviewStatsDTO(
                total,
                alive,
                genderStats,
                ageGroupStats
        );
    }

    public WardPersonStatsDTO getWardPersonStats(Integer wardId) {
        long totalInWard = countPersonsInWard(wardId);
        long aliveInWard = countAlivePersonsInWard(wardId);

        long male = countAliveMaleInWard(wardId);
        long female = countAliveFemaleInWard(wardId);

        AgeGroupStatsDTO ageGroupStats = countAlivePersonsByAgeGroupInWard(wardId);

        long tempResidents = countActiveTemporaryResidentsInWard(wardId);
        long tempAbsences = countActiveTemporaryAbsencesWithPermWard(wardId);

        GenderStatsDTO genderStats = new GenderStatsDTO(male, female);

        return new WardPersonStatsDTO(
                wardId,
                totalInWard,
                aliveInWard,
                genderStats,
                ageGroupStats,
                tempResidents,
                tempAbsences
        );
    }

    private long countAllPersons() {
        return personRepository.count();
    }

    private long countAlivePersons() {
        return personRepository.count(aliveSpec());
    }

    private long countPersonsInWard(Integer wardId) {
        return personRepository.count(wardSpec(wardId));
    }

    private long countAlivePersonsInWard(Integer wardId) {
        Specification<Person> spec = Specification.where(wardSpec(wardId)).and(aliveSpec());
        return personRepository.count(spec);
    }

    private long countAlivePersonsInWardByGender(Integer wardId, String genderValue) {
        Specification<Person> spec = Specification
                .where(wardSpec(wardId))
                .and(aliveSpec())
                .and((root, query, cb) -> cb.equal(root.get("gender"), genderValue));
        return personRepository.count(spec);
    }

    private long countAliveMaleInWard(Integer wardId) {
        return countAlivePersonsInWardByGender(wardId, "M");
    }

    private long countAliveFemaleInWard(Integer wardId) {
        return countAlivePersonsInWardByGender(wardId, "F");
    }

    private AgeGroupStatsDTO countAlivePersonsByAgeGroupInWard(Integer wardId) {
        LocalDate today = LocalDate.now();
        LocalDate age18Cutoff = today.minusYears(18);
        LocalDate age60Cutoff = today.minusYears(60);

        Specification<Person> base = Specification.where(wardSpec(wardId)).and(aliveSpec());

        long age0To17 = personRepository.count(
                base.and((root, query, cb) ->
                        cb.greaterThan(root.get("dateOfBirth"), age18Cutoff))
        );

        long age18To60 = personRepository.count(
                base.and((root, query, cb) ->
                        cb.and(
                                cb.lessThanOrEqualTo(root.get("dateOfBirth"), age18Cutoff),
                                cb.greaterThanOrEqualTo(root.get("dateOfBirth"), age60Cutoff)
                        ))
        );

        long ageOver60 = personRepository.count(
                base.and((root, query, cb) ->
                        cb.lessThan(root.get("dateOfBirth"), age60Cutoff))
        );

        return new AgeGroupStatsDTO(age0To17, age18To60, ageOver60);
    }

    private long countActiveTemporaryResidentsInWard(Integer wardId) {
        LocalDate today = LocalDate.now();

        Specification<TemporaryResidence> spec = (root, query, cb) -> {
            Join<TemporaryResidence, ?> wardJoin = root.join("tempAddressWard", JoinType.INNER);
            return cb.and(
                    cb.equal(wardJoin.get("id"), wardId),
                    cb.lessThanOrEqualTo(root.get("startDate"), today),
                    cb.or(
                            cb.isNull(root.get("endDate")),
                            cb.greaterThanOrEqualTo(root.get("endDate"), today)
                    )
            );
        };

        return personTemporaryResidenceRepository.count(spec);
    }

    private long countActiveTemporaryAbsencesWithPermWard(Integer wardId) {
        LocalDate today = LocalDate.now();

        Specification<TemporaryAbsence> spec = (root, query, cb) -> {
            Join<TemporaryAbsence, ?> permWardJoin = root.join("permAddressWard", JoinType.INNER);
            return cb.and(
                    cb.equal(permWardJoin.get("id"), wardId),
                    cb.lessThanOrEqualTo(root.get("startDate"), today),
                    cb.or(
                            cb.isNull(root.get("endDate")),
                            cb.greaterThanOrEqualTo(root.get("endDate"), today)
                    )
            );
        };

        return personTemporaryAbsenceRepository.count(spec);
    }
}
