package com.soict.service;

import com.soict.dto.household.HouseholdDTO;
import com.soict.entity.household.Household;
import com.soict.repository.household.HouseholdRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HouseholdService {

    private final HouseholdRepository householdRepository;

    public HouseholdService(HouseholdRepository householdRepository) {
        this.householdRepository = householdRepository;
    }

    public List<HouseholdDTO> getAllHouseholds() {
        return householdRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private HouseholdDTO toDTO(Household entity) {
        HouseholdDTO dto = new HouseholdDTO();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setHouseAddressDetails(entity.getHouseAddressDetails());
        return dto;
    }
}