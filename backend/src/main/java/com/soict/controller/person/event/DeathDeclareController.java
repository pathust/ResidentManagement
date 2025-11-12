package com.soict.controller.person.event;

import com.soict.dto.person.DeathDeclareCreateDTO;
import com.soict.dto.person.DeathDeclareDTO;
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
@RequestMapping("/api/persons/death-declares")
@Tag(name = "Death Declare", description = "APIs for death declaration")
public class DeathDeclareController {

    private final PersonService personService;

    @Operation(summary = "Create death declare require only one: personId or idNumber")
    @PostMapping
    public ResponseEntity<DeathDeclareDTO> create(@Valid @RequestBody DeathDeclareCreateDTO req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(personService.createDeathDeclare(req));
    }
    @Operation(summary = "Get all death declares")
    @GetMapping("/all")
    public ResponseEntity<List<DeathDeclareDTO>> getAll() {
        return ResponseEntity.ok(personService.getAllDeathDeclares());
    }

    @Operation(summary = "Get death declare by id")
    @GetMapping("/{id}")
    public ResponseEntity<DeathDeclareDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(personService.getDeathDeclareById(id));
    }

    @Operation(summary = "Get death declares (paginated)")
    @GetMapping("/page")
    public ResponseEntity<Page<DeathDeclareDTO>> getAllPaginated(
            @Parameter Pageable pageable,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String idNumber,
            @RequestParam(required = false) String declarerName,
            @RequestParam(required = false) String declarerIdNumber,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) Integer wardId
    ) {
        return ResponseEntity.ok(
                personService.getDeathDeclaresPaginated(
                        pageable, name, idNumber, declarerName, declarerIdNumber, startDate, endDate, wardId
                )
        );
    }
    @Operation(summary = "Delete a death declare")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        personService.deleteDeathDeclare(id);
        return ResponseEntity.noContent().build();
    }
}
