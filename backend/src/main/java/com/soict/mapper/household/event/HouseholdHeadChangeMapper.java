package com.soict.mapper.household.event;

import com.soict.dto.household.HouseholdHeadChangeCreateDTO;
import com.soict.dto.household.HouseholdHeadChangeDTO;
import com.soict.dto.household.HouseholdHeadChangeUpdateDTO;
import com.soict.entity.household.Household;
import com.soict.entity.household.event.HouseholdHeadChange;
import com.soict.entity.person.Person;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HouseholdHeadChangeMapper {

    @Mapping(target = "householdId", source = "household.id")
    @Mapping(target = "fromPersonId", source = "fromPerson.id")
    @Mapping(target = "toPersonId", source = "toPerson.id")
    HouseholdHeadChangeDTO toDTO(HouseholdHeadChange entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "household", ignore = true)
    @Mapping(target = "fromPerson", ignore = true)
    @Mapping(target = "toPerson", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    HouseholdHeadChange toEntity(HouseholdHeadChangeCreateDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "household", ignore = true)
    @Mapping(target = "fromPerson", ignore = true)
    @Mapping(target = "toPerson", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntityFromDTO(HouseholdHeadChangeUpdateDTO dto, @MappingTarget HouseholdHeadChange entity);

}
