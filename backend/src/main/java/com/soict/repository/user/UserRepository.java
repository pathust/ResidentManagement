package com.soict.repository.user;

import com.soict.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT u FROM User u " +
            "JOIN FETCH u.role r " +
            "LEFT JOIN FETCH r.rolePermissions rp " +
            "LEFT JOIN FETCH rp.permission " +
            "WHERE u.username = :username")
    Optional<User> findByUsernameWithDetails(@Param("username") String username);

    boolean existsByUsername(String username);

    Optional<User> findByUsername(String username);

    Page<User> findByRoleId(Integer roleId, Pageable pageable);
}
