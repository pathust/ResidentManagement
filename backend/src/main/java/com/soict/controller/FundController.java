package com.soict.controller;

import com.soict.dto.fund.*;
import com.soict.service.FundService;
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
@RequestMapping("/api/funds")
@RequiredArgsConstructor
@Tag(name = "Fund Management", description = "APIs for managing funds, transactions, transfers, and expenses")
public class FundController {

    private final FundService fundService;

    // ========== FUND ==========
    @Operation(summary = "Get all funds")
    @GetMapping
    @PreAuthorize("hasAnyAuthority('VIEW_FUND', 'ROLE_ADMIN')")
    public ResponseEntity<List<FundDTO>> getAllFunds() {
        return ResponseEntity.ok(fundService.getAllFunds());
    }

    @Operation(summary = "Get fund by ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('VIEW_FUND', 'ROLE_ADMIN')")
    public ResponseEntity<FundDTO> getFundById(@PathVariable Integer id) {
        return ResponseEntity.ok(fundService.getFundById(id));
    }

    @Operation(summary = "Create new fund")
    @PostMapping
    @PreAuthorize("hasAnyAuthority('CREATE_FUND', 'ROLE_ADMIN')")
    public ResponseEntity<FundDTO> createFund(@Valid @RequestBody FundCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(fundService.createFund(dto));
    }

    @Operation(summary = "Update fund")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('UPDATE_FUND', 'ROLE_ADMIN')")
    public ResponseEntity<FundDTO> updateFund(@PathVariable Integer id, @Valid @RequestBody FundUpdateDTO dto) {
        return ResponseEntity.ok(fundService.updateFund(id, dto));
    }

    @Operation(summary = "Delete fund")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteFund(@PathVariable Integer id) {
        fundService.deleteFund(id);
        return ResponseEntity.noContent().build();
    }

    // ========== TRANSACTION ==========
    @Operation(summary = "Get transactions with pagination")
    @GetMapping("/transactions")
    @PreAuthorize("hasAnyAuthority('VIEW_FUND', 'ROLE_ADMIN')")
    public ResponseEntity<Page<FundTransactionDTO>> getTransactionsPaginated(
            @Parameter(description = "Pagination parameters") Pageable pageable,
            @RequestParam(required = false) Integer fundId,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(fundService.getTransactionsPaginated(pageable, fundId, type));
    }

    @Operation(summary = "Create new transaction")
    @PostMapping("/transactions")
    @PreAuthorize("hasAnyAuthority('CREATE_FUND', 'ROLE_ADMIN')")
    public ResponseEntity<FundTransactionDTO> createTransaction(@Valid @RequestBody FundTransactionCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(fundService.createTransaction(dto));
    }

    // ========== TRANSFER ==========
    @Operation(summary = "Get transfers with pagination")
    @GetMapping("/transfers")
    @PreAuthorize("hasAnyAuthority('VIEW_FUND', 'ROLE_ADMIN')")
    public ResponseEntity<Page<FundTransferDTO>> getTransfersPaginated(
            @Parameter(description = "Pagination parameters") Pageable pageable,
            @RequestParam(required = false) Integer sourceFundId,
            @RequestParam(required = false) Integer destFundId) {
        return ResponseEntity.ok(fundService.getTransfersPaginated(pageable, sourceFundId, destFundId));
    }

    @Operation(summary = "Create new transfer")
    @PostMapping("/transfers")
    @PreAuthorize("hasAnyAuthority('CREATE_FUND', 'ROLE_ADMIN')")
    public ResponseEntity<FundTransferDTO> createTransfer(@Valid @RequestBody FundTransferCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(fundService.createTransfer(dto));
    }

    // ========== EXPENSE ==========
    @Operation(summary = "Get expenses with pagination")
    @GetMapping("/expenses")
    @PreAuthorize("hasAnyAuthority('VIEW_FUND', 'ROLE_ADMIN')")
    public ResponseEntity<Page<ExpenseDTO>> getExpensesPaginated(
            @Parameter(description = "Pagination parameters") Pageable pageable,
            @RequestParam(required = false) Integer fundId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(fundService.getExpensesPaginated(pageable, fundId, status));
    }

    @Operation(summary = "Create new expense")
    @PostMapping("/expenses")
    @PreAuthorize("hasAnyAuthority('CREATE_FUND', 'ROLE_ADMIN')")
    public ResponseEntity<ExpenseDTO> createExpense(@Valid @RequestBody ExpenseCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(fundService.createExpense(dto));
    }

    @Operation(summary = "Update expense")
    @PutMapping("/expenses/{id}")
    @PreAuthorize("hasAnyAuthority('UPDATE_FUND', 'ROLE_ADMIN')")
    public ResponseEntity<ExpenseDTO> updateExpense(@PathVariable Integer id, @Valid @RequestBody ExpenseUpdateDTO dto) {
        return ResponseEntity.ok(fundService.updateExpense(id, dto));
    }
}
