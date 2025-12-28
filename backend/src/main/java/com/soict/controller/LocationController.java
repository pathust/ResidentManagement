package com.soict.controller;

import com.soict.dto.location.*;
import com.soict.service.LocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/location")
@Tag(name = "Location information", description = "APIs for location information data")
public class LocationController {
    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    // ========== ETHNICITY ENDPOINTS ==========
    @Operation(summary = "Get all ethnicities", description = "Retrieve a list of ethnicities")
    @GetMapping("/ethnicities")
    public ResponseEntity<List<EthnicityDTO>> getEthnicities(){
        return ResponseEntity.ok(locationService.getAllEthnicities());
    }

    @Operation(summary = "Get ethnicity by ID")
    @GetMapping("/ethnicities/{id}")
    public  ResponseEntity<EthnicityDTO> getEthnicityById(@PathVariable Integer id){
        return ResponseEntity.ok(locationService.getEthnicityById(id));
    }

    @Operation(summary = "Create new ethnicity")
    @PostMapping("/ethnicities")
    public ResponseEntity<EthnicityDTO> createEthnicities(@Valid @RequestBody EthnicityUpdateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(locationService.createEthnicity(dto));
    }

    @Operation(summary = "Update ethnicity information")
    @PutMapping("/ethnicities/{id}")
    public ResponseEntity<EthnicityDTO> updateEthnicities(
            @PathVariable Integer id,
            @Valid @RequestBody EthnicityUpdateDTO dto) {
        return ResponseEntity.ok(locationService.updateEthnicityById(id, dto));
    }

    @Operation(summary = "Delete ethnicity")
    @DeleteMapping("/ethnicities/{id}")
    public ResponseEntity<Void> deleteEthnicities(@PathVariable Integer id) {
        locationService.deleteEthnicityById(id);
        return ResponseEntity.noContent().build();
    }

    // ========== PROVINCE ENDPOINTS ==========
    @Operation(summary = "Get all provinces", description = "Retrieve a list of provinces")
    @GetMapping("/provinces")
    public ResponseEntity<List<ProvinceDTO>> getProvinces(
            @Valid @RequestParam(defaultValue = "false") boolean includeWards){
        return ResponseEntity.ok(locationService.getAllProvinces(includeWards));
    }

    @Operation(summary = "Get province by ID")
    @GetMapping("/provinces/{id}")
    public ResponseEntity<ProvinceDTO> getProvincesById(
            @PathVariable Integer id,
            @Valid @RequestParam(defaultValue = "false") boolean includeWards){
        return ResponseEntity.ok(locationService.getProvinceById(id, includeWards));
    }

    @Operation(summary = "Create new province")
    @PostMapping("provinces")
    public ResponseEntity<ProvinceDTO> createProvinces(@Valid @RequestBody ProvinceUpdateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(locationService.createProvince(dto));
    }

    @Operation(summary = "Update province information")
    @PutMapping("/provinces/{id}")
    public ResponseEntity<ProvinceDTO> updateProvinces(
            @PathVariable Integer id,
            @Valid @RequestBody ProvinceUpdateDTO dto) {
        return ResponseEntity.ok(locationService.updateProvinceById(id, dto));
    }

    @Operation(summary = "Delete province")
    @DeleteMapping("/provinces/{id}")
    public ResponseEntity<Void> deleteProvinces(@PathVariable Integer id) {
        locationService.deleteProvinceById(id);
        return ResponseEntity.noContent().build();
    }

    // ========== WARD ENDPOINTS ==========
    @GetMapping("/wards")
    public ResponseEntity<List<WardDTO>> getWards(
            @Valid @RequestParam(required = false) Integer provinceId) {
        if  (provinceId != null) {
            return ResponseEntity.ok(locationService.getWardsByProvinceId(provinceId));
        }
        return ResponseEntity.ok(locationService.getAllWards());
    }

    @GetMapping("/wards/{id}")
    public ResponseEntity<WardDTO> getWardById(@PathVariable Integer id) {
        return ResponseEntity.ok(locationService.getWardById(id));
    }

    @PostMapping("/wards")
    public ResponseEntity<WardDTO> createWard(@Valid @RequestBody WardUpdateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(locationService.createWard(dto));
    }

    @PutMapping("wards/{id}")
    public ResponseEntity<WardDTO> updateWard(
            @PathVariable Integer id,
            @Valid @RequestBody WardUpdateDTO dto) {
        return ResponseEntity.ok(locationService.updateWardById(id, dto));
    }

    @DeleteMapping("wards/{id}")
    public ResponseEntity<Void> deleteWard(@PathVariable Integer id) {
        locationService.deleteWardById(id);
        return ResponseEntity.noContent().build();
    }
}
