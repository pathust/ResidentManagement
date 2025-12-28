package com.soict.controller;

import com.soict.dto.user.ChangePasswordDTO;
import com.soict.dto.user.UserCreateDTO;
import com.soict.dto.user.UserResponseDTO;
import com.soict.dto.user.UserUpdateDTO;
import com.soict.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "APIs for managing users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Get all users with pagination")
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Page<UserResponseDTO>> getAllUsers(
            @Parameter(description = "Pagination parameters") Pageable pageable,
            @RequestParam(required = false) Integer roleId) {
        return ResponseEntity.ok(userService.getAllUsers(pageable, roleId));
    }

    @Operation(summary = "Get user by ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @Operation(summary = "Create a new user")
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.createUser(dto));
    }

    @Operation(summary = "Update user details")
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UserUpdateDTO dto) {
        return ResponseEntity.ok(userService.updateUser(id, dto));
    }

    @Operation(summary = "Change user password")
    @PutMapping("/{id}/password")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> changePassword(
            @PathVariable Integer id,
            @Valid @RequestBody ChangePasswordDTO dto) {
        userService.changePassword(id, dto);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Delete (disable) user")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
