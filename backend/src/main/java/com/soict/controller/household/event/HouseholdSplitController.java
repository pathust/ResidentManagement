package com.soict.controller.household.event;

import com.soict.dto.household.HouseholdSplitCreateDTO;
import com.soict.dto.household.HouseholdSplitDTO;
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
@RequestMapping("/api/households/splits")
@Tag(name = "Household Split", description = "APIs for splitting households")
public class HouseholdSplitController {

    private final HouseholdService householdService;

    @Operation(summary = "Create a household split")
    @PostMapping
    public ResponseEntity<HouseholdSplitDTO> create(@RequestBody HouseholdSplitCreateDTO dto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(householdService.createHouseholdSplit(dto));
    }

    @Operation(summary = "Delete a household split by id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        householdService.deleteHouseholdSplit(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get a household split by id")
    @GetMapping("/{id}")
    public ResponseEntity<HouseholdSplitDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(householdService.getHouseholdSplitById(id));
    }

    @Operation(summary = "Get all household splits")
    @GetMapping("/all")
    public ResponseEntity<List<HouseholdSplitDTO>> getAll() {
        return ResponseEntity.ok(householdService.getAllHouseholdSplits());
    }

    @Operation(summary = "Get household splits (paginated)")
    @GetMapping("/page")
    public ResponseEntity<Page<HouseholdSplitDTO>> getPage(
            @Parameter(description = "Pagination parameters") Pageable pageable,
            @RequestParam(required = false) String fromHouseholdCode,
            @RequestParam(required = false) String toHouseholdCode,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(
                householdService.getHouseholdSplitsPaginated(
                        pageable, fromHouseholdCode, toHouseholdCode, startDate, endDate
                )
        );
    }
}
