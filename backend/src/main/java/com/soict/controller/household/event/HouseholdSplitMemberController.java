package com.soict.controller.household.event;

import com.soict.dto.household.HouseholdSplitMemberDTO;
import com.soict.service.HouseholdService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/households/split-members")
@Tag(name = "Household Split Member", description = "APIs for members in a household split")
public class HouseholdSplitMemberController {

    private final HouseholdService householdService;

    @Operation(summary = "Get a split member by id")
    @GetMapping("/{id}")
    public ResponseEntity<HouseholdSplitMemberDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(householdService.getHouseholdSplitMemberById(id));
    }

    @Operation(summary = "Delete a split member by id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        householdService.deleteHouseholdSplitMember(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get all split members")
    @GetMapping("/all")
    public ResponseEntity<List<HouseholdSplitMemberDTO>> getAll() {
        return ResponseEntity.ok(householdService.getAllHouseholdSplitMembers());
    }

    @Operation(summary = "Get split members (paginated)")
    @GetMapping("/page")
    public ResponseEntity<Page<HouseholdSplitMemberDTO>> getPage(
            @Parameter(description = "Pagination parameters") Pageable pageable,
            @RequestParam(required = false) Integer splitId,
            @RequestParam(required = false) String personName,
            @RequestParam(required = false) String personIdNumber,
            @RequestParam(required = false) Boolean isHead
    ) {
        return ResponseEntity.ok(
                householdService.getHouseholdSplitMembersPaginated(
                        pageable, splitId, personName, personIdNumber, isHead
                )
        );
    }
}
