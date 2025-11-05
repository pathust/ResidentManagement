package com.soict.controller.person.event;

import com.soict.dto.person.TemporaryResidenceCreateDTO;
import com.soict.dto.person.TemporaryResidenceDTO;
import com.soict.dto.person.TemporaryResidenceUpdateDTO;
import com.soict.service.PersonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/persons/temporary-residences")
@Tag(name = "Temporary Residence", description = "APIs for temporary residence management")
public class TemporaryResidenceController {

    private final PersonService personService;

    @Operation(summary = "Create temporary residence")
    @PostMapping
    public ResponseEntity<TemporaryResidenceDTO> create(
            @Valid @RequestBody TemporaryResidenceCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(personService.createTemporaryResidence(dto));
    }

    @Operation(summary = "Delete a temporary residence by id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        personService.deleteTemporaryResidence(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get a temporary residence by id")
    @GetMapping("/{id}")
    public ResponseEntity<TemporaryResidenceDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(personService.getTemporaryResidenceById(id));
    }

    @Operation(summary = "Get all temporary residences")
    @GetMapping("/all")
    public ResponseEntity<List<TemporaryResidenceDTO>> getAll() {
        return ResponseEntity.ok(personService.getAllTemporaryResidences());
    }

    @Operation(summary = "Get temporary residences (paginated)")
    @GetMapping("/page")
    public ResponseEntity<Page<TemporaryResidenceDTO>> getPage(
            @Parameter(description = "Pagination parameters") Pageable pageable,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String idNumber,
            @RequestParam(required = false) String householdNumber,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) Integer wardId
    ) {
        return ResponseEntity.ok(
                personService.getTemporaryResidencesPaginated(
                        pageable, name, idNumber, householdNumber, startDate, endDate, wardId
                )
        );
    }

    @Operation(summary = "End a temporary residence by id")
    @PatchMapping("/{id}/end")
    public ResponseEntity<TemporaryResidenceDTO> end(
            @PathVariable Integer id,
            @Valid @RequestBody TemporaryResidenceUpdateDTO body) {
        return ResponseEntity.ok(personService.endTemporaryResidence(id, body));
    }
}
