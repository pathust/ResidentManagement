package com.soict.controller.household.event;

import com.soict.dto.household.HouseholdAddressChangeCreateDTO;
import com.soict.dto.household.HouseholdAddressChangeDTO;
import com.soict.service.HouseholdService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/households/address-changes")
@Tag(name = "Household Address Change", description = "APIs for managing household address changes")
public class HouseholdAddressChangeController {

    private final HouseholdService householdService;

    @Operation(summary = "Create a household address change")
    @PostMapping
    public ResponseEntity<HouseholdAddressChangeDTO> create(
            @RequestBody HouseholdAddressChangeCreateDTO dto
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(householdService.createHouseholdAddressChange(dto));
    }

    @Operation(summary = "Delete a household address change by id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        householdService.deleteHouseholdAddressChange(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get a household address change by id")
    @GetMapping("/{id}")
    public ResponseEntity<HouseholdAddressChangeDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(householdService.getHouseholdAddressChangeById(id));
    }

    @Operation(summary = "Get household address changes (paginated)")
    @GetMapping("/page")
    public ResponseEntity<Page<HouseholdAddressChangeDTO>> getPage(
            @Parameter(description = "Pagination parameters") Pageable pageable,
            @RequestParam(required = false) String householdCode,
            @RequestParam(required = false) Integer fromAddressWardId,
            @RequestParam(required = false) Integer toAddressWardId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(
                householdService.getHouseholdAddressChangesPaginated(
                        pageable, householdCode, fromAddressWardId, toAddressWardId, startDate, endDate
                )
        );
    }

    @Operation(summary = "Get all household address changes")
    @GetMapping("/all")
    public ResponseEntity<List<HouseholdAddressChangeDTO>> getAll() {
        return ResponseEntity.ok(householdService.getAllHouseholdAddressChanges());
    }
}
