package com.soict.dto.user;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateDTO {
    @Size(min = 8, max = 100)
    private String password;

    private Integer roleId;

    private Integer manageWardId;

    @Pattern(regexp = "ACTIVE|DISABLED", message = "Status must be ACTIVE or DISABLED")
    private String status;
}
