package com.soict.service;

import com.soict.dto.user.ChangePasswordDTO;
import com.soict.dto.user.UserCreateDTO;
import com.soict.dto.user.UserResponseDTO;
import com.soict.dto.user.UserUpdateDTO;
import com.soict.entity.location.Ward;
import com.soict.entity.user.Role;
import com.soict.entity.user.User;
import com.soict.exception.ResourceNotFoundException;
import com.soict.exception.DuplicateResourceException;
import com.soict.mapper.UserMapper;
import com.soict.repository.location.WardRepository;
import com.soict.repository.user.RoleRepository;
import com.soict.repository.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final WardRepository wardRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
            RoleRepository roleRepository,
            WardRepository wardRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.wardRepository = wardRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO createUser(UserCreateDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new DuplicateResourceException("User", "username", dto.getUsername());
        }

        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        Ward ward = null;
        if (dto.getManageWardId() != null) {
            ward = wardRepository.findById(dto.getManageWardId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ward not found"));
        }

        User user = userMapper.toUser(dto);
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setRole(role);
        user.setManageWard(ward);
        user.setStatus(User.UserStatus.ACTIVE);

        user = userRepository.save(user);
        return userMapper.toUserResponseDTO(user);
    }

    public UserResponseDTO updateUser(Integer id, UserUpdateDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        userMapper.updateUserFromDTO(dto, user);

        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        user.setRole(role);

        if (dto.getManageWardId() != null) {
            Ward ward = wardRepository.findById(dto.getManageWardId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ward not found"));
            user.setManageWard(ward);
        } else {
            user.setManageWard(null);
        }

        user = userRepository.save(user);
        return userMapper.toUserResponseDTO(user);
    }

    public void changePassword(Integer id, ChangePasswordDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toUserResponseDTO(user);
    }

    @Transactional(readOnly = true)
    public Page<UserResponseDTO> getAllUsers(Pageable pageable, Integer roleId) {
        if (roleId != null) {
            return userRepository.findByRoleId(roleId, pageable)
                    .map(userMapper::toUserResponseDTO);
        }
        return userRepository.findAll(pageable)
                .map(userMapper::toUserResponseDTO);
    }

    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        // Soft delete
        user.setStatus(User.UserStatus.DISABLED);
        userRepository.save(user);
    }
}
