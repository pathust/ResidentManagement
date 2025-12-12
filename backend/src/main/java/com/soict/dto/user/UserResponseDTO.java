package com.soict.dto.user;

import com.soict.entity.user.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponseDTO {
    private Integer id;
    private String username;
    private Integer roleId;
    private String roleName;
    private User.UserStatus status;
    private Integer manageWardId;
    private String manageWardName;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
