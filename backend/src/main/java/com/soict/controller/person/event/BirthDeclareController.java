package com.soict.controller.person.event;

import com.soict.dto.person.event.BirthDeclareRequest;
import com.soict.dto.person.BirthDeclareDTO;
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
@RequestMapping("/api/persons/birth-declares")
@Tag(name = "Birth Declare", description = "APIs for birth declaration")
public class BirthDeclareController {

    private final PersonService personService;

    @Operation(summary = "Create birth declare (existing person), do not pass in PersonCreate")
    @PostMapping
    public ResponseEntity<BirthDeclareDTO> create(@Valid @RequestBody BirthDeclareRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(personService.createBirthDeclare(req));
    }

    @Operation(summary = "Get all birth declares")
    @GetMapping("/all")
    public ResponseEntity<List<BirthDeclareDTO>> getAll() {
        return ResponseEntity.ok(personService.getAllBirthDeclares());
    }

    @Operation(summary = "Get birth declares by id")
    @GetMapping("/{id}")
    public ResponseEntity<BirthDeclareDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(personService.getBirthDeclareById(id));
    }

    @Operation(summary = "Get birth declares (paginated)")
    @GetMapping("/page")
    public ResponseEntity<Page<BirthDeclareDTO>> getAllPaginated(
            @Parameter Pageable pageable,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String idNumber,
            @RequestParam(required = false) String declarerName,
            @RequestParam(required = false) String declarerIdNumber,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) Integer wardId) {
        return ResponseEntity.ok(
            personService.getBirthDeclaresPaginated(
                pageable, name, idNumber, declarerName, declarerIdNumber, startDate, endDate, wardId
            )
        );
    }

    @Operation(summary = "Delete a birth declare")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        personService.deleteBirthDeclare(id);
        return ResponseEntity.noContent().build();
    }
}
