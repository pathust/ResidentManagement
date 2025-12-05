package com.soict.mapper.person;

import com.soict.dto.person.*;
import com.soict.entity.person.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PersonMapper {

    // ========== Entity → DTO ==========
    @Mapping(target = "placeOfOriginWardName", source = "placeOfOriginWard.name")
    @Mapping(target = "placeOfOriginProvinceName", source = "placeOfOriginWard.province.name")
    @Mapping(target = "ethnicityName", source = "ethnicity.name")
    @Mapping(target = "currentHouseholdCode", source = "currentHousehold.code")
    @Mapping(target = "permAddressWardName", source = "permAddressWard.name")
    @Mapping(target = "permAddressProvinceName", source = "permAddressWard.province.name")
    @Mapping(target = "tempAddressWardName", source = "tempAddressWard.name")
    @Mapping(target = "tempAddressProvinceName", source = "tempAddressWard.province.name")
    PersonDTO toDTO(Person person);

    // ========== CreateDTO → Entity ==========
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "placeOfOriginWard", ignore = true)
    @Mapping(target = "ethnicity", ignore = true)
    @Mapping(target = "currentHousehold", ignore = true)
    @Mapping(target = "permAddressWard", ignore = true)
    @Mapping(target = "tempAddressWard", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Person toEntity(PersonCreateDTO dto);

    // ========== UpdateDTO → Entity ==========
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "placeOfOriginWard", ignore = true)
    @Mapping(target = "ethnicity", ignore = true)
    @Mapping(target = "currentHousehold", ignore = true)
    @Mapping(target = "permAddressWard", ignore = true)
    @Mapping(target = "tempAddressWard", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(PersonUpdateDTO dto, @MappingTarget Person entity);
}