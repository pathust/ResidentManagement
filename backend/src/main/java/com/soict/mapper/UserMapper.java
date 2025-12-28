package com.soict.mapper;

import com.soict.dto.user.UserCreateDTO;
import com.soict.dto.user.UserResponseDTO;
import com.soict.dto.user.UserUpdateDTO;
import com.soict.entity.user.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

    @Mapping(target = "roleId", source = "role.id")
    @Mapping(target = "roleName", source = "role.role")
    @Mapping(target = "manageWardId", source = "manageWard.id")
    @Mapping(target = "manageWardName", source = "manageWard.name")
    UserResponseDTO toUserResponseDTO(User user);

    @Mapping(target = "role", ignore = true)
    @Mapping(target = "manageWard", ignore = true)
    @Mapping(target = "passwordHash", ignore = true) // Handled in service
    User toUser(UserCreateDTO dto);

    @Mapping(target = "role", ignore = true)
    @Mapping(target = "manageWard", ignore = true)
    void updateUserFromDTO(UserUpdateDTO dto, @MappingTarget User user);
}
