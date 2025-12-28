package com.soict.mapper.person.event;

import com.soict.dto.person.PermanentResidenceChangeCreateDTO;
import com.soict.dto.person.PermanentResidenceChangeDTO;
import com.soict.dto.person.PermanentResidenceChangeUpdateDTO;
import com.soict.entity.person.event.PermanentResidenceChange;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface PermanentResidenceChangeMapper {

    // Entity -> DTO
    @Mapping(target = "id", source = "id")
    @Mapping(target = "personId", source = "person.id")
    @Mapping(target = "personName", source = "person.fullName")
    @Mapping(target = "personIdNumber", source = "person.idNumber")

    @Mapping(target = "currentHouseholdId", source = "currentHousehold.id")
    @Mapping(target = "currentHouseholdCode", source = "currentHousehold.code")

    @Mapping(target = "prevAddressWardId", source = "prevAddressWard.id")
    @Mapping(target = "prevAddressWardName", source = "prevAddressWard.name")
    @Mapping(target = "addressWardId", source = "addressWard.id")
    @Mapping(target = "addressWardName", source = "addressWard.name")
    PermanentResidenceChangeDTO toDTO(PermanentResidenceChange e);

    // CreateDTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "currentHousehold", ignore = true)
    @Mapping(target = "prevAddressWard", ignore = true)
    @Mapping(target = "addressWard", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PermanentResidenceChange toEntity(PermanentResidenceChangeCreateDTO dto);

    // UpdateDTO -> Entity
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "currentHousehold", ignore = true)
    @Mapping(target = "prevAddressWard", ignore = true)
    @Mapping(target = "addressWard", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(PermanentResidenceChangeUpdateDTO dto, @MappingTarget PermanentResidenceChange entity);
}
