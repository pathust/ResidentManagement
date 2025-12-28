package com.soict.controller.household;

import com.soict.dto.household.*;
import com.soict.service.HouseholdService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/households")
@Tag(name = "Household Management", description = "APIs for managing households")
public class HouseholdController {

    private final HouseholdService householdService;

    public HouseholdController(HouseholdService householdService) {
        this.householdService = householdService;
    }

    @Operation(summary = "Get all households")
    @GetMapping
    @PreAuthorize("hasAnyAuthority('VIEW_HOUSEHOLD', 'ROLE_ADMIN')")
    public ResponseEntity<Page<HouseholdDTO>> getAll(
            Pageable pageable,
            @RequestParam(required = false) Integer wardId,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(householdService.getAllHouseholds(pageable, wardId, search));
    }

    @Operation(summary = "Get household by ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('VIEW_HOUSEHOLD', 'ROLE_ADMIN')")
    public ResponseEntity<HouseholdDetailDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(householdService.getHouseholdById(id));
    }

    @Operation(summary = "Create new household")
    @PostMapping
    @PreAuthorize("hasAnyAuthority('CREATE_HOUSEHOLD', 'ROLE_ADMIN')")
    public ResponseEntity<HouseholdDTO> create(@Valid @RequestBody HouseholdCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(householdService.createHousehold(dto));
    }

    @Operation(summary = "Update household information")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('UPDATE_HOUSEHOLD', 'ROLE_ADMIN')")
    public ResponseEntity<HouseholdDTO> update(
            @PathVariable Integer id,
            @Valid @RequestBody HouseholdUpdateDTO dto) {
        return ResponseEntity.ok(householdService.updateHousehold(id, dto));
    }

    @Operation(summary = "Delete household")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        householdService.deleteHousehold(id);
        return ResponseEntity.noContent().build();
    }

    // Household Membership Management

    @Operation(summary = "Add member to household")
    @PostMapping("/{id}/members")
    @PreAuthorize("hasAnyAuthority('UPDATE_HOUSEHOLD', 'ROLE_ADMIN')")
    public ResponseEntity<HouseholdMembershipDTO> addMember(
            @PathVariable Integer id,
            @Valid @RequestBody HouseholdMembershipCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(householdService.addMember(id, dto));
    }

    @Operation(summary = "Remove member from household")
    @DeleteMapping("/{id}/members/{membershipId}")
    @PreAuthorize("hasAnyAuthority('UPDATE_HOUSEHOLD', 'ROLE_ADMIN')")
    public ResponseEntity<Void> removeMember(
            @PathVariable Integer id,
            @PathVariable Integer membershipId) {
        householdService.removeMember(id, membershipId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Update member relationship")
    @PutMapping("/{id}/members/{membershipId}")
    @PreAuthorize("hasAnyAuthority('UPDATE_HOUSEHOLD', 'ROLE_ADMIN')")
    public ResponseEntity<HouseholdMembershipDTO> updateMember(
            @PathVariable Integer id,
            @PathVariable Integer membershipId,
            @Valid @RequestBody HouseholdMembershipUpdateDTO dto) {
        return ResponseEntity.ok(householdService.updateMember(id, membershipId, dto));
    }

    @Operation(summary = "Get household members")
    @GetMapping("/{id}/members")
    @PreAuthorize("hasAnyAuthority('VIEW_HOUSEHOLD', 'ROLE_ADMIN')")
    public ResponseEntity<List<HouseholdMemberDTO>> getMembers(@PathVariable Integer id) {
        return ResponseEntity.ok(householdService.getHouseholdMembers(id));
    }

    @Operation(summary = "Search households")
    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('VIEW_HOUSEHOLD', 'ROLE_ADMIN')")
    public ResponseEntity<Page<HouseholdDTO>> search(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) Integer wardId,
            @RequestParam(required = false) String headName,
            Pageable pageable) {
        return ResponseEntity.ok(householdService.searchHouseholds(
                code, address, wardId, headName, pageable));
    }

    @Operation(summary = "Init household with members (create household + memberships)")
    @PostMapping("/init")
    @PreAuthorize("hasAnyAuthority('CREATE_HOUSEHOLD', 'ROLE_ADMIN')")
    public ResponseEntity<HouseholdDetailDTO> initHousehold(
            @Valid @RequestBody HouseholdInitCreateDTO dto
    ) {
        HouseholdDetailDTO result = householdService.initHousehold(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @Operation(summary = "Change a person's household (transfer membership)")
    @PostMapping("/change-household")
    @PreAuthorize("hasAnyAuthority('UPDATE_HOUSEHOLD', 'ROLE_ADMIN')")
    public ResponseEntity<HouseholdChangeDTO> changeHousehold(
            @Valid @RequestBody HouseholdChangeCreateDTO dto
    ) {
        HouseholdChangeDTO result = householdService.changeHousehold(dto);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Get all membership history of a household")
    @GetMapping("/{id}/memberships")
    @PreAuthorize("hasAnyAuthority('VIEW_HOUSEHOLD', 'ROLE_ADMIN')")
    public ResponseEntity<List<HouseholdMembershipDTO>> getAllMemberships(@PathVariable Integer id) {
        return ResponseEntity.ok(householdService.getAllMembershipsByHouseholdId(id));
    }

    @Operation(summary = "Get all membership history of a household paginated")
    @GetMapping("/{id}/memberships/page")
    @PreAuthorize("hasAnyAuthority('VIEW_HOUSEHOLD', 'ROLE_ADMIN')")
    public ResponseEntity<Page<HouseholdMembershipDTO>> getAllMembershipsPaginated(
            @PathVariable Integer id,
            Pageable pageable) {
        return ResponseEntity.ok(householdService.getAllMembershipsByHouseholdIdPaginated(id, pageable));
    }
}