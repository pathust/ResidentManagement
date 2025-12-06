package com.soict.controller;

import com.soict.dto.fee.*;
import com.soict.service.FeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
@Tag(name = "Fee Management", description = "APIs for managing fees, collection events, and payments")
public class FeeController {

    private final FeeService feeService;

    // ========== FEE TYPE ==========
    @Operation(summary = "Get all fee types")
    @GetMapping("/types")
    @PreAuthorize("hasAnyAuthority('VIEW_FEE', 'ROLE_ADMIN')")
    public ResponseEntity<List<FeeTypeDTO>> getAllFeeTypes() {
        return ResponseEntity.ok(feeService.getAllFeeTypes());
    }

    @Operation(summary = "Get fee type by ID")
    @GetMapping("/types/{id}")
    @PreAuthorize("hasAnyAuthority('VIEW_FEE', 'ROLE_ADMIN')")
    public ResponseEntity<FeeTypeDTO> getFeeTypeById(@PathVariable Integer id) {
        return ResponseEntity.ok(feeService.getFeeTypeById(id));
    }

    @Operation(summary = "Create new fee type")
    @PostMapping("/types")
    @PreAuthorize("hasAnyAuthority('CREATE_FEE', 'ROLE_ADMIN')")
    public ResponseEntity<FeeTypeDTO> createFeeType(@Valid @RequestBody FeeTypeCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(feeService.createFeeType(dto));
    }

    @Operation(summary = "Update fee type")
    @PutMapping("/types/{id}")
    @PreAuthorize("hasAnyAuthority('UPDATE_FEE', 'ROLE_ADMIN')")
    public ResponseEntity<FeeTypeDTO> updateFeeType(@PathVariable Integer id, @Valid @RequestBody FeeTypeUpdateDTO dto) {
        return ResponseEntity.ok(feeService.updateFeeType(id, dto));
    }

    @Operation(summary = "Delete fee type")
    @DeleteMapping("/types/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteFeeType(@PathVariable Integer id) {
        feeService.deleteFeeType(id);
        return ResponseEntity.noContent().build();
    }

    // ========== COLLECTION EVENT ==========
    @Operation(summary = "Get collection events with pagination")
    @GetMapping("/events")
    @PreAuthorize("hasAnyAuthority('VIEW_FEE', 'ROLE_ADMIN')")
    public ResponseEntity<Page<CollectionEventDTO>> getCollectionEventsPaginated(
            @Parameter(description = "Pagination parameters") Pageable pageable,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer feeTypeId) {
        return ResponseEntity.ok(feeService.getCollectionEventsPaginated(pageable, status, feeTypeId));
    }

    @Operation(summary = "Get collection event by ID")
    @GetMapping("/events/{id}")
    @PreAuthorize("hasAnyAuthority('VIEW_FEE', 'ROLE_ADMIN')")
    public ResponseEntity<CollectionEventDTO> getCollectionEventById(@PathVariable Integer id) {
        return ResponseEntity.ok(feeService.getCollectionEventById(id));
    }

    @Operation(summary = "Create new collection event")
    @PostMapping("/events")
    @PreAuthorize("hasAnyAuthority('CREATE_FEE', 'ROLE_ADMIN')")
    public ResponseEntity<CollectionEventDTO> createCollectionEvent(@Valid @RequestBody CollectionEventCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(feeService.createCollectionEvent(dto));
    }

    @Operation(summary = "Update collection event")
    @PutMapping("/events/{id}")
    @PreAuthorize("hasAnyAuthority('UPDATE_FEE', 'ROLE_ADMIN')")
    public ResponseEntity<CollectionEventDTO> updateCollectionEvent(@PathVariable Integer id, @Valid @RequestBody CollectionEventUpdateDTO dto) {
        return ResponseEntity.ok(feeService.updateCollectionEvent(id, dto));
    }

    @Operation(summary = "Delete collection event")
    @DeleteMapping("/events/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteCollectionEvent(@PathVariable Integer id) {
        feeService.deleteCollectionEvent(id);
        return ResponseEntity.noContent().build();
    }

    // ========== PAYMENT ==========
    @Operation(summary = "Get payments with pagination")
    @GetMapping("/payments")
    @PreAuthorize("hasAnyAuthority('VIEW_FEE', 'ROLE_ADMIN')")
    public ResponseEntity<Page<PaymentDTO>> getPaymentsPaginated(
            @Parameter(description = "Pagination parameters") Pageable pageable,
            @RequestParam(required = false) Integer collectionEventId,
            @RequestParam(required = false) Integer householdId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(feeService.getPaymentsPaginated(pageable, collectionEventId, householdId, status));
    }

    @Operation(summary = "Get payment by ID")
    @GetMapping("/payments/{id}")
    @PreAuthorize("hasAnyAuthority('VIEW_FEE', 'ROLE_ADMIN')")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable Integer id) {
        return ResponseEntity.ok(feeService.getPaymentById(id));
    }

    @Operation(summary = "Record new payment")
    @PostMapping("/payments")
    @PreAuthorize("hasAnyAuthority('CREATE_FEE', 'ROLE_ADMIN')")
    public ResponseEntity<PaymentDTO> createPayment(@Valid @RequestBody PaymentCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(feeService.createPayment(dto));
    }

    @Operation(summary = "Update payment")
    @PutMapping("/payments/{id}")
    @PreAuthorize("hasAnyAuthority('UPDATE_FEE', 'ROLE_ADMIN')")
    public ResponseEntity<PaymentDTO> updatePayment(@PathVariable Integer id, @Valid @RequestBody PaymentUpdateDTO dto) {
        return ResponseEntity.ok(feeService.updatePayment(id, dto));
    }
}
