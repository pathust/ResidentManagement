package com.soict.mapper.person.event;

import com.soict.dto.person.BirthDeclareDTO;
import com.soict.entity.person.event.BirthDeclare;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface BirthDeclareMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "personId", source = "person.id")
    @Mapping(target = "declarerId", source = "declarer.id")
    @Mapping(target = "fatherId", source = "father.id")
    @Mapping(target = "motherId", source = "mother.id")
    @Mapping(target = "placeOfOriginWardId", source = "placeOfOriginWard.id")
    @Mapping(target = "dateOfBirth", source = "person.dateOfBirth")
    @Mapping(target = "placeOfBirth", source = "person.placeOfBirth")
    BirthDeclareDTO toDTO(BirthDeclare e);
}
