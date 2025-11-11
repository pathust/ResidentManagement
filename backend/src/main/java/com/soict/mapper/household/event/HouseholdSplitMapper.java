package com.soict.mapper.household.event;

import com.soict.dto.household.HouseholdSplitCreateDTO;
import com.soict.dto.household.HouseholdSplitDTO;
import com.soict.dto.household.HouseholdSplitUpdateDTO;
import com.soict.entity.household.event.HouseholdSplit;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HouseholdSplitMapper {

    @Mapping(target = "fromHouseholdId", source = "fromHousehold.id")
    @Mapping(target = "toHouseholdId",   source = "toHousehold.id")
    @Mapping(target = "members", ignore = true)
    HouseholdSplitDTO toDTO(HouseholdSplit entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "fromHousehold", ignore = true)
    @Mapping(target = "toHousehold", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "splitDate", source = "splitDate")
    @Mapping(target = "note", source = "note")
    HouseholdSplit toEntity(HouseholdSplitCreateDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "fromHousehold", ignore = true)
    @Mapping(target = "toHousehold", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntityFromDTO(HouseholdSplitUpdateDTO dto, @MappingTarget HouseholdSplit entity);
}
