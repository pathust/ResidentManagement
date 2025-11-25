package com.soict.service;

import com.soict.dto.user.UserCreateDTO;
import com.soict.dto.user.UserDTO;
import com.soict.dto.user.UserUpdateDTO;
import com.soict.entity.location.Ward;
import com.soict.entity.user.Role;
import com.soict.entity.user.User;
import com.soict.exception.BusinessException;
import com.soict.exception.ResourceNotFoundException;
import com.soict.mapper.user.UserMapper;
import com.soict.repository.location.WardRepository;
import com.soict.repository.user.RoleRepository;
import com.soict.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final WardRepository wardRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    // ========== BASIC CRUD ==========

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Page<UserDTO> getUsersPaginated(Pageable pageable,
                                           Integer manageWardId,
                                           Integer roleId,
                                           String status) {
        Specification<User> spec = Specification.where(null);
        if (manageWardId != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("manageWard").get("id"), manageWardId)
            );
        }

        if (roleId != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("role").get("id"), roleId)
            );
        }

        if (status != null && !status.isEmpty()) {
            User.UserStatus enumStatus;
            try {
                enumStatus = User.UserStatus.valueOf(status);
            } catch (IllegalArgumentException ex) {
                throw new BusinessException("Invalid user status: " + status);
            }

            User.UserStatus finalEnumStatus = enumStatus;
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), finalEnumStatus)
            );
        }

        return userRepository.findAll(spec, pageable)
                .map(userMapper::toDTO);
    }

    public UserDTO getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toDTO(user);
    }

    @Transactional
    public UserDTO createUser(UserCreateDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new BusinessException("Username already exists: " + dto.getUsername());
        }

        User user = userMapper.toEntity(dto);

        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        user.setPasswordHash(encodedPassword);

        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Role not found with id: " + dto.getRoleId()));
        user.setRole(role);

        if (dto.getManageWardId() != null) {
            Ward ward = wardRepository.findById(dto.getManageWardId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Ward not found with id: " + dto.getManageWardId()));
            user.setManageWard(ward);
        } else {
            user.setManageWard(null);
        }

        if (user.getStatus() == null) {
            user.setStatus(User.UserStatus.ACTIVE);
        }

        User saved = userRepository.save(user);
        return userMapper.toDTO(saved);
    }

    @Transactional
    public UserDTO updateUser(Integer id, UserUpdateDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            String encodedPassword = passwordEncoder.encode(dto.getPassword());
            user.setPasswordHash(encodedPassword);
        }

        if (dto.getRoleId() != null) {
            Role role = roleRepository.findById(dto.getRoleId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Role not found with id: " + dto.getRoleId()));
            user.setRole(role);
        }

        if (dto.getManageWardId() != null) {
            Ward ward = wardRepository.findById(dto.getManageWardId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Ward not found with id: " + dto.getManageWardId()));
            user.setManageWard(ward);
        }

        if (dto.getStatus() != null && !dto.getStatus().isEmpty()) {
            try {
                User.UserStatus enumStatus = User.UserStatus.valueOf(dto.getStatus());
                user.setStatus(enumStatus);
            } catch (IllegalArgumentException ex) {
                throw new BusinessException("Invalid user status: " + dto.getStatus());
            }
        }

        User updated = userRepository.save(user);
        return userMapper.toDTO(updated);
    }

    @Transactional
    public void deleteUser(Integer id) {
        User user = userRepository.findById(id).orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            String currentUsername = auth.getName();

            if (currentUsername != null && currentUsername.equals(user.getUsername())) {
                throw new BusinessException("You cannot delete your own account");
            }
        }

        userRepository.delete(user);
    }
}
