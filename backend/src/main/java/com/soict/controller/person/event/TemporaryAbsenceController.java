package com.soict.controller.person.event;

import com.soict.dto.person.TemporaryAbsenceCreateDTO;
import com.soict.dto.person.TemporaryAbsenceDTO;
import com.soict.dto.person.TemporaryAbsenceUpdateDTO;
import com.soict.service.PersonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
@RequestMapping("/api/persons/temporary-absences")
@Tag(name = "Temporary Absence", description = "APIs for temporary absence (tạm vắng)")
public class TemporaryAbsenceController {

    private final PersonService personService;
    @Operation(summary = "Create a temporary absence")
    @PostMapping
    public ResponseEntity<TemporaryAbsenceDTO> create(
            @Valid @RequestBody TemporaryAbsenceCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(personService.createTemporaryAbsence(dto));
    }

    @Operation(summary = "Delete a temporary absence by id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        personService.deleteTemporaryAbsence(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get a temporary absence by id")
    @GetMapping("/{id}")
    public ResponseEntity<TemporaryAbsenceDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(personService.getTemporaryAbsenceById(id));
    }

    @Operation(summary = "Get all temporary absences (list, sorted by startDate DESC)")
    @GetMapping("/all")
    public ResponseEntity<List<TemporaryAbsenceDTO>> getAll() {
        return ResponseEntity.ok(personService.getAllTemporaryAbsences());
    }

    @Operation(summary = "Get temporary absences (paginated)")
    @GetMapping("/page")
    public ResponseEntity<Page<TemporaryAbsenceDTO>> getPage(
            @Parameter(description = "Pagination parameters") Pageable pageable,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String idNumber,
            @RequestParam(required = false) String householdNumber,
            @RequestParam(required = false) Integer permAddressWardId,
            @RequestParam(required = false) Integer tempAddressWardId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        Page<TemporaryAbsenceDTO> page = personService.getTemporaryAbsencesPaginated(
                pageable, name, idNumber, householdNumber, permAddressWardId, tempAddressWardId, startDate, endDate
        );
        return ResponseEntity.ok(page);
    }

    @Operation(summary = "End a temporary absence")
    @PatchMapping("/{id}/end")
    public ResponseEntity<TemporaryAbsenceDTO> end(
            @PathVariable Integer id,
            @Valid @RequestBody TemporaryAbsenceUpdateDTO dto
    ) {
        return ResponseEntity.ok(personService.endTemporaryAbsence(id, dto));
    }
}
