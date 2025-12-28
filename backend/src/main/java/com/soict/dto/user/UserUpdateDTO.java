package com.soict.dto.user;

import com.soict.entity.user.User;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserUpdateDTO {
    @NotNull(message = "Status is required")
    private User.UserStatus status;

    @NotNull(message = "Role ID is required")
    private Integer roleId;

    private Integer manageWardId;
}
