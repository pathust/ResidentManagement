package com.soict.mapper.household.event;

import com.soict.dto.household.HouseholdAddressChangeCreateDTO;
import com.soict.dto.household.HouseholdAddressChangeDTO;
import com.soict.dto.household.HouseholdAddressChangeUpdateDTO;
import com.soict.entity.household.Household;
import com.soict.entity.household.event.HouseholdAddressChange;
import com.soict.entity.location.Ward;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HouseholdAddressChangeMapper {

    @Mapping(target = "householdId", source = "household.id")
    @Mapping(target = "fromAddressWardId", source = "fromAddressWard.id")
    @Mapping(target = "toAddressWardId", source = "toAddressWard.id")
    HouseholdAddressChangeDTO toDTO(HouseholdAddressChange entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "household", ignore = true)
    @Mapping(target = "fromAddressWard", ignore = true)
    @Mapping(target = "toAddressWard", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    HouseholdAddressChange toEntity(HouseholdAddressChangeCreateDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "household", ignore = true)
    @Mapping(target = "fromAddressWard", ignore = true)
    @Mapping(target = "toAddressWard", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntityFromDTO(HouseholdAddressChangeUpdateDTO dto,
                             @MappingTarget HouseholdAddressChange entity);

}
