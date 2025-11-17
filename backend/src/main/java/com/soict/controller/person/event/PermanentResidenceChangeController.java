package com.soict.controller.person.event;

import com.soict.dto.person.PermanentResidenceChangeCreateDTO;
import com.soict.dto.person.PermanentResidenceChangeDTO;
import com.soict.service.PersonService;
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
@RequestMapping("/api/persons/permanent-residence-changes")
@Tag(name = "Permanent Residence Change", description = "APIs for managing permanent residence changes")
public class PermanentResidenceChangeController {

    private final PersonService personService;

    @Operation(summary = "Create a permanent residence change")
    @PostMapping
    public ResponseEntity<PermanentResidenceChangeDTO> create(
            @RequestBody PermanentResidenceChangeCreateDTO dto
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(personService.createPermanentResidenceChange(dto));
    }

    @Operation(summary = "Delete a permanent residence change by id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        personService.deletePermanentResidenceChange(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get a permanent residence change by id")
    @GetMapping("/{id}")
    public ResponseEntity<PermanentResidenceChangeDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(personService.getPermanentResidenceChangeById(id));
    }

    @Operation(summary = "Get permanent residence changes (paginated)")
    @GetMapping("/page")
    public ResponseEntity<Page<PermanentResidenceChangeDTO>> getPage(
            @Parameter(description = "Pagination parameters") Pageable pageable,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String idNumber,
            @RequestParam(required = false) String householdNumber,
            @RequestParam(required = false) Integer prevAddressWardId,
            @RequestParam(required = false) Integer addressWardId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(
                personService.getPermanentResidenceChangesPaginated(
                        pageable, name, idNumber, householdNumber,
                        prevAddressWardId, addressWardId, startDate, endDate
                )
        );
    }

    @Operation(summary = "Get all permanent residence changes")
    @GetMapping("/all")
    public ResponseEntity<List<PermanentResidenceChangeDTO>> getAll() {
        return ResponseEntity.ok(personService.getAllPermanentResidenceChanges());
    }
}
