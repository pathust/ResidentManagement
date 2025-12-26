
package com.soict.controller.person;

import com.soict.dto.household.HouseholdMembershipDTO;
import com.soict.dto.person.*;
import com.soict.service.PersonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
@RequestMapping("/api/persons")
@Tag(name = "Person Management", description = "APIs for managing persons and their information")
public class PersonController {

    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @Operation(summary = "Get all persons", description = "Retrieves a list of all persons")
    @ApiResponse(responseCode = "200", description = "Successful operation")
    @GetMapping
    @PreAuthorize("hasAnyAuthority('VIEW_PERSON', 'ROLE_ADMIN')")
    public ResponseEntity<List<PersonDTO>> getAll() {
        return ResponseEntity.ok(personService.getAllPersons());
    }

    @Operation(summary = "Get persons with pagination")
    @GetMapping("/page")
    @PreAuthorize("hasAnyAuthority('VIEW_PERSON', 'ROLE_ADMIN')")
    public ResponseEntity<Page<PersonDTO>> getAllPaginated(
            @Parameter(description = "Pagination parameters") Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer wardId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(personService.getAllPersonsPaginated(pageable, search, wardId, status));
    }

    @Operation(summary = "Get person by ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('VIEW_PERSON', 'ROLE_ADMIN')")
    public ResponseEntity<PersonDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(personService.getPersonById(id));
    }

    @Operation(summary = "Create new person")
    @PostMapping
    @PreAuthorize("hasAnyAuthority('CREATE_PERSON', 'ROLE_ADMIN')")
    public ResponseEntity<PersonDTO> create(@Valid @RequestBody PersonCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(personService.createPerson(dto));
    }

    @Operation(summary = "Update person information")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('UPDATE_PERSON', 'ROLE_ADMIN')")
    public ResponseEntity<PersonDTO> update(
            @PathVariable Integer id,
            @Valid @RequestBody PersonUpdateDTO dto) {
        return ResponseEntity.ok(personService.updatePerson(id, dto));
    }

    @Operation(summary = "Delete person")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        personService.deletePerson(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get all household memberships of a person")
    @GetMapping("/{id}/memberships")
    @PreAuthorize("hasAnyAuthority('VIEW_PERSON', 'ROLE_ADMIN')")
    public ResponseEntity<List<HouseholdMembershipDTO>> getMemberships(@PathVariable Integer id) {
        return ResponseEntity.ok(personService.getMembershipsByPersonId(id));
    }

    @Operation(summary = "Get household memberships of a person with pagination")
    @GetMapping("/{id}/memberships/page")
    @PreAuthorize("hasAnyAuthority('VIEW_PERSON', 'ROLE_ADMIN')")
    public ResponseEntity<Page<HouseholdMembershipDTO>> getMembershipsPaginated(
            @PathVariable Integer id,
            Pageable pageable) {
        return ResponseEntity.ok(personService.getMembershipsByPersonIdPaginated(id, pageable));
    }
}