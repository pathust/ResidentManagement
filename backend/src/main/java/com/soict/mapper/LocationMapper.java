package com.soict.mapper;

import com.soict.dto.location.*;
import com.soict.entity.location.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface LocationMapper {

    // Ethnicity mappings
    EthnicityDTO toEthnicityDTO(Ethnicity ethnicity);

    Ethnicity toEthnicityEntity(EthnicityUpdateDTO dto);

    void updateEthnicityFromDTO(EthnicityUpdateDTO dto, @MappingTarget Ethnicity entity);

    // Ward mappings
    @Mapping(target = "provinceId", source = "province.id")
    @Mapping(target = "provinceName", source = "province.name")
    WardDTO toWardDTO(Ward ward);

    @Mapping(target = "province", ignore = true)
    Ward toWardEntity(WardUpdateDTO dto);

    @Mapping(target = "province", ignore = true)
    void updateWardFromDTO(WardUpdateDTO dto, @MappingTarget Ward entity);

    // Province mappings
    ProvinceDTO toProvinceDTO(Province province);

    @Mapping(target = "wards", ignore = true)
    ProvinceDTO toProvinceDTOWithoutWards(Province province);

    @Mapping(target = "wards", ignore = true)
    Province toProvinceEntity(ProvinceUpdateDTO dto);

    @Mapping(target = "wards", ignore = true)
    void updateProvinceFromDTO(ProvinceUpdateDTO dto, @MappingTarget Province entity);
}