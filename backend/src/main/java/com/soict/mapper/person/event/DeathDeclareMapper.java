package com.soict.mapper.person.event;

import com.soict.dto.person.DeathDeclareDTO;
import com.soict.entity.person.event.DeathDeclare;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface DeathDeclareMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "personId", source = "person.id")
    @Mapping(target = "idNumber", source = "person.idNumber")
    @Mapping(target = "declarerId", source = "declarer.id")
    @Mapping(target = "dateOfDeclaration", source = "dateOfDeclaration")
    @Mapping(target = "timeOfDeath", source = "timeOfDeath")
    @Mapping(target = "lastPermanentResidenceWardId", source = "lastPermanentResidenceWard.id")
    @Mapping(target = "lastPermanentResidenceDetails", source = "lastPermanentResidenceDetails")
    @Mapping(target = "note", source = "note")
    DeathDeclareDTO toDTO(DeathDeclare e);
}