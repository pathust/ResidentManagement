package com.soict.controller.household.event;

import com.soict.dto.household.HouseholdHeadChangeCreateDTO;
import com.soict.dto.household.HouseholdHeadChangeDTO;
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
@RequestMapping("/api/households/head-changes")
@Tag(name = "Household Head Change", description = "APIs for managing household head changes")
public class HouseholdHeadChangeController {

    private final HouseholdService householdService;

    @Operation(summary = "Create a household head change")
    @PostMapping
    public ResponseEntity<HouseholdHeadChangeDTO> create(
            @RequestBody HouseholdHeadChangeCreateDTO dto
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(householdService.createHouseholdHeadChange(dto));
    }

    @Operation(summary = "Delete a household head change by id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        householdService.deleteHouseholdHeadChange(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get a household head change by id")
    @GetMapping("/{id}")
    public ResponseEntity<HouseholdHeadChangeDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(householdService.getHouseholdHeadChangeById(id));
    }

    @Operation(summary = "Get household head changes (paginated)")
    @GetMapping("/page")
    public ResponseEntity<Page<HouseholdHeadChangeDTO>> getPage(
            @Parameter(description = "Pagination parameters") Pageable pageable,
            @RequestParam(required = false) String householdCode,
            @RequestParam(required = false) Integer fromPersonId,
            @RequestParam(required = false) Integer toPersonId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(
                householdService.getHouseholdHeadChangesPaginated(
                        pageable, householdCode, fromPersonId, toPersonId, startDate, endDate
                )
        );
    }

    @Operation(summary = "Get all household head changes")
    @GetMapping("/all")
    public ResponseEntity<List<HouseholdHeadChangeDTO>> getAll() {
        return ResponseEntity.ok(householdService.getAllHouseholdHeadChanges());
    }
}
