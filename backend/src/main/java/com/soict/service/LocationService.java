package com.soict.service;

import com.soict.dto.location.*;
import com.soict.entity.location.Ethnicity;
import com.soict.entity.location.Province;
import com.soict.entity.location.Ward;
import com.soict.exception.BusinessException;
import com.soict.exception.ResourceNotFoundException;
import com.soict.mapper.LocationMapper;
import com.soict.repository.location.EthnicityRepository;
import com.soict.repository.location.ProvinceRepository;
import com.soict.repository.location.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LocationService {

    private final EthnicityRepository ethnicityRepository;
    private final ProvinceRepository provinceRepository;
    private final WardRepository wardRepository;
    private final LocationMapper locationMapper;

    // ========== ETHNICITY CRUD ==========

    public List<EthnicityDTO> getAllEthnicities() {
        return ethnicityRepository.findAll().stream()
                .map(locationMapper::toEthnicityDTO)
                .collect(Collectors.toList());
    }

    public EthnicityDTO getEthnicityById(Integer id) {
        Ethnicity ethnicity = ethnicityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ethnicity not found"));
        return locationMapper.toEthnicityDTO(ethnicity);
    }

    @Transactional
    public EthnicityDTO createEthnicity(EthnicityUpdateDTO dto) {
        if (ethnicityRepository.existsByName(dto.getName())) {
            throw new BusinessException("Ethnicity already exists");
        }
        Ethnicity ethnicity = locationMapper.toEthnicityEntity(dto);
        Ethnicity saved =  ethnicityRepository.save(ethnicity);
        return locationMapper.toEthnicityDTO(saved);
    }

    @Transactional
    public EthnicityDTO updateEthnicityById(Integer id, EthnicityUpdateDTO dto) {
        Ethnicity existing = ethnicityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ethnicity not found"));

        if (!existing.getName().equals(dto.getName()) && ethnicityRepository.existsByName(dto.getName())) {
            throw new BusinessException("Ethnicity already exists");
        }

        locationMapper.updateEthnicityFromDTO(dto, existing);
        Ethnicity updated = ethnicityRepository.save(existing);
        return locationMapper.toEthnicityDTO(updated);
    }

    @Transactional
    public void deleteEthnicityById(Integer id) {
        if (!ethnicityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ethnicity not found with id " + id);
        }
        ethnicityRepository.deleteById(id);
    }

    // ========== PROVINCE CRUD ==========

    public List<ProvinceDTO> getAllProvinces(boolean includeWards) {
        if (includeWards) {
            return provinceRepository.findAll().stream()
                    .map(locationMapper::toProvinceDTO)
                    .collect(Collectors.toList());
        }
        return  provinceRepository.findAll().stream()
                .map(locationMapper::toProvinceDTOWithoutWards)
                .collect(Collectors.toList());
    }

    public ProvinceDTO getProvinceById(Integer id,  boolean includeWards) {
        Province province = provinceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Province not found"));
        return includeWards ?
                locationMapper.toProvinceDTO(province) :
                locationMapper.toProvinceDTOWithoutWards(province);
    }

    @Transactional
    public ProvinceDTO createProvince(ProvinceUpdateDTO dto) {
        if (provinceRepository.existsByName(dto.getName())) {
            throw new BusinessException("Province already exists");
        }
        Province province = locationMapper.toProvinceEntity(dto);
        Province saved = provinceRepository.save(province);
        return locationMapper.toProvinceDTOWithoutWards(saved);
    }

    @Transactional
    public ProvinceDTO updateProvinceById(Integer id, ProvinceUpdateDTO dto) {
        Province existing = provinceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Province not found"));

        if (!existing.getName().equals(dto.getName()) && provinceRepository.existsByName(dto.getName())) {
            throw new BusinessException("Province already exists");
        }

        locationMapper.updateProvinceFromDTO(dto, existing);
        Province updated = provinceRepository.save(existing);
        return locationMapper.toProvinceDTOWithoutWards(updated);
    }

    @Transactional
    public void deleteProvinceById(Integer id) {
        if (!provinceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Province not found with id " + id);
        }

        if (wardRepository.existsProvinceById(id)) {
            throw new BusinessException("Cannot delete province that has wards");
        }
        provinceRepository.deleteById(id);
    }

    // ========== WARD CRUD ==========
    public List<WardDTO> getAllWards() {
        return wardRepository.findAll().stream()
                .map(locationMapper::toWardDTO)
                .collect(Collectors.toList());
    }

    public List<WardDTO> getWardsByProvinceId(Integer provinceId) {
        if (!provinceRepository.existsById(provinceId)) {
            throw  new BusinessException("Province not  found with id " + provinceId);
        }

        return wardRepository.findByProvinceId(provinceId).stream()
                .map(locationMapper::toWardDTO)
                .collect(Collectors.toList());
    }

    public WardDTO getWardById(Integer id) {
        Ward ward = wardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found with id " + id));
        return locationMapper.toWardDTO(ward);
    }

    @Transactional
    public WardDTO createWard(WardUpdateDTO dto) {
        Province province = provinceRepository.findById(dto.getProvinceId())
                .orElseThrow(() -> new ResourceNotFoundException("Province not found with id " + dto.getProvinceId()));

        Ward ward = locationMapper.toWardEntity(dto);
        ward.setProvince(province);

        Ward saved = wardRepository.save(ward);
        return locationMapper.toWardDTO(saved);
    }

    @Transactional
    public WardDTO updateWardById(Integer id, WardUpdateDTO dto) {
        Ward existing = wardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found with id " + id));

        if (dto.getProvinceId() != null && !dto.getProvinceId().equals(existing.getProvince().getId())) {
            Province province = provinceRepository.findById(dto.getProvinceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Province not found with id " + dto.getProvinceId()));
            existing.setProvince(province);
        }

        locationMapper.updateWardFromDTO(dto, existing);
        Ward updated = wardRepository.save(existing);
        return locationMapper.toWardDTO(updated);
    }

    @Transactional
    public void deleteWardById(Integer id) {
        if (!wardRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ward not found with id " + id);
        }
        wardRepository.deleteById(id);
    }
}