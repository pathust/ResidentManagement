// src/main/java/com/soict/mapper/household/event/HouseholdSplitMemberMapper.java
package com.soict.mapper.household.event;

import com.soict.dto.household.HouseholdSplitMemberCreateDTO;
import com.soict.dto.household.HouseholdSplitMemberDTO;
import com.soict.dto.household.HouseholdSplitMemberUpdateDTO;
import com.soict.entity.household.event.HouseholdSplitMember;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HouseholdSplitMemberMapper {

    @Mapping(target = "personId", source = "person.id")
    HouseholdSplitMemberDTO toDTO(HouseholdSplitMember entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "householdSplit", ignore = true)
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "isHead", source = "isHead")
    HouseholdSplitMember toEntity(HouseholdSplitMemberCreateDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "householdSplit", ignore = true)
    @Mapping(target = "person", ignore = true)
    void updateEntityFromDTO(HouseholdSplitMemberUpdateDTO dto, @MappingTarget HouseholdSplitMember entity);
}
