package com.soict.mapper.person.event;

import com.soict.dto.person.TemporaryResidenceCreateDTO;
import com.soict.dto.person.TemporaryResidenceDTO;
import com.soict.dto.person.TemporaryResidenceUpdateDTO;
import com.soict.entity.person.event.TemporaryResidence;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface TemporaryResidenceMapper {

    // Entity -> DTO
    @Mapping(target = "personId", source = "person.id")
    @Mapping(target = "personName", source = "person.fullName")
    @Mapping(target = "personIdNumber", source = "person.idNumber")
    @Mapping(target = "currentHouseholdId", source = "currentHousehold.id")
    @Mapping(target = "currentHouseholdCode", source = "currentHousehold.code")
    @Mapping(target = "tempAddressWardId", source = "tempAddressWard.id")
    @Mapping(target = "tempAddressWardName", source = "tempAddressWard.name")
    TemporaryResidenceDTO toDTO(TemporaryResidence e);

    // CreateDTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "currentHousehold", ignore = true)
    @Mapping(target = "tempAddressWard", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    TemporaryResidence toEntity(TemporaryResidenceCreateDTO dto);

    // UpdateDTO -> Entity
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "currentHousehold", ignore = true)
    @Mapping(target = "tempAddressWard", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(TemporaryResidenceUpdateDTO dto, @MappingTarget TemporaryResidence entity);
}
