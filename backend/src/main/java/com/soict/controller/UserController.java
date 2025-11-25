package com.soict.controller;

import com.soict.dto.user.UserCreateDTO;
import com.soict.dto.user.UserDTO;
import com.soict.dto.user.UserUpdateDTO;
import com.soict.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "User Management", description = "APIs for managing users")

public class UserController {

    private final UserService userService;

    @GetMapping("/all")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping
    public Page<UserDTO> getUsersPaginated(
            Pageable pageable,
            @RequestParam(required = false) Integer manageWardId,
            @RequestParam(required = false) Integer roleId,
            @RequestParam(required = false) String status
    ) {
        return userService.getUsersPaginated(pageable, manageWardId, roleId, status);
    }

    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO createUser(@Valid @RequestBody UserCreateDTO dto) {
        return userService.createUser(dto);
    }

    @PutMapping("/{id}")
    public UserDTO updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UserUpdateDTO dto
    ) {
        return userService.updateUser(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
    }
}
