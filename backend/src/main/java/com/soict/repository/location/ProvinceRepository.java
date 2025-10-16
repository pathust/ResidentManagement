package com.soict.repository.location;

import com.soict.entity.location.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProvinceRepository extends JpaRepository<Province, Integer> {
    List<Province> findByNameContainingIgnoreCase(String name);
}