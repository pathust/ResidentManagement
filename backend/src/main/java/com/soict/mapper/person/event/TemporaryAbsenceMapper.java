package com.soict.mapper.person.event;

import com.soict.dto.person.TemporaryAbsenceCreateDTO;
import com.soict.dto.person.TemporaryAbsenceDTO;
import com.soict.dto.person.TemporaryAbsenceUpdateDTO;
import com.soict.entity.person.event.TemporaryAbsence;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface TemporaryAbsenceMapper {

    // Entity -> DTO
    @Mapping(target = "personId", source = "person.id")
    @Mapping(target = "personName", source = "person.fullName")
    @Mapping(target = "personIdNumber", source = "person.idNumber")
    @Mapping(target = "currentHouseholdId", source = "currentHousehold.id")
    @Mapping(target = "householdCode", source = "currentHousehold.code")
    @Mapping(target = "permAddressWardId", source = "permAddressWard.id")
    @Mapping(target = "permAddressWardName", source = "permAddressWard.name")
    @Mapping(target = "tempAddressWardId", source = "tempAddressWard.id")
    @Mapping(target = "tempAddressWardName", source = "tempAddressWard.name")
    TemporaryAbsenceDTO toDTO(TemporaryAbsence e);

    // CreateDTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "currentHousehold", ignore = true)
    @Mapping(target = "permAddressWard", ignore = true)
    @Mapping(target = "tempAddressWard", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    TemporaryAbsence toEntity(TemporaryAbsenceCreateDTO dto);

    // UpdateDTO -> Entity
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "currentHousehold", ignore = true)
    @Mapping(target = "permAddressWard", ignore = true)
    @Mapping(target = "tempAddressWard", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(TemporaryAbsenceUpdateDTO dto, @MappingTarget TemporaryAbsence entity);
}
