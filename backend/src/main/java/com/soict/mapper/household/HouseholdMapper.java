package com.soict.mapper.household;

import com.soict.dto.household.*;
import com.soict.entity.household.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HouseholdMapper {

    // ========== HOUSEHOLD MAPPING ==========

    @Mapping(target = "wardId", source = "ward.id")
    @Mapping(target = "wardName", source = "ward.name")
    @Mapping(target = "provinceName", source = "ward.province.name")
    HouseholdDTO toDTO(Household household);

    @Mapping(target = "wardId", source = "ward.id")
    @Mapping(target = "wardName", source = "ward.name")
    @Mapping(target = "provinceName", source = "ward.province.name")
    HouseholdDetailDTO toDetailDTO(Household household);

    @Mapping(target = "ward", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Household toEntity(HouseholdCreateDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "code", ignore = true)
    @Mapping(target = "ward", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(HouseholdUpdateDTO dto, @MappingTarget Household entity);

    // ========== HOUSEHOLD MEMBER MAPPING ==========

    @Mapping(target = "membershipId", source = "id")
    @Mapping(target = "personId", source = "person.id")
    @Mapping(target = "fullName", source = "person.fullName")
    @Mapping(target = "dateOfBirth", source = "person.dateOfBirth")
    @Mapping(target = "gender", source = "person.gender")
    @Mapping(target = "idNumber", source = "person.idNumber")
    @Mapping(target = "phoneNumber", source = "person.phoneNumber")
    @Mapping(target = "status", source = "person.status")
    HouseholdMemberDTO toMemberDTO(HouseholdMembership membership);

    // ========== HOUSEHOLD MEMBERSHIP MAPPING ==========

    @Mapping(target = "householdId", source = "household.id")
    @Mapping(target = "householdCode", source = "household.code")
    @Mapping(target = "personId", source = "person.id")
    @Mapping(target = "personName", source = "person.fullName")
    @Mapping(target = "prevPermAddressWardId", source = "prevPermAddressWard.id")
    @Mapping(target = "prevPermAddressWardName", source = "prevPermAddressWard.name")
    HouseholdMembershipDTO toMembershipDTO(HouseholdMembership membership);

    @Mapping(target = "household", ignore = true)
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "prevPermAddressWard", ignore = true)
    HouseholdMembership toMembershipEntity(HouseholdMembershipCreateDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "household", ignore = true)
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "startDate", ignore = true)
    void updateMembershipFromDTO(HouseholdMembershipUpdateDTO dto, @MappingTarget HouseholdMembership entity);
}