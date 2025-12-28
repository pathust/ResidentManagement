package com.soict.service;

import com.soict.dto.fund.*;
import com.soict.entity.fund.Expense;
import com.soict.entity.fund.Fund;
import com.soict.entity.fund.FundTransaction;
import com.soict.entity.fund.FundTransfer;
import com.soict.entity.user.User;
import com.soict.exception.BusinessException;
import com.soict.exception.ResourceNotFoundException;
import com.soict.mapper.fund.FundMapper;
import com.soict.repository.fund.ExpenseRepository;
import com.soict.repository.fund.FundRepository;
import com.soict.repository.fund.FundTransactionRepository;
import com.soict.repository.fund.FundTransferRepository;
import com.soict.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FundService {
    private final FundRepository fundRepository;
    private final FundTransactionRepository fundTransactionRepository;
    private final FundTransferRepository fundTransferRepository;
    private final ExpenseRepository expenseRepository;
    private final FundMapper fundMapper;
    private final UserRepository userRepository;

    // ========== FUND ==========
    public List<FundDTO> getAllFunds() {
        return fundRepository.findAll().stream()
                .map(fundMapper::toDTO)
                .collect(Collectors.toList());
    }

    public FundDTO getFundById(Integer id) {
        Fund fund = fundRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fund not found with id: " + id));
        return fundMapper.toDTO(fund);
    }

    @Transactional
    public FundDTO createFund(FundCreateDTO dto) {
        Fund fund = fundMapper.toEntity(dto);
        if (fund.getBalance() == null) fund.setBalance(BigDecimal.ZERO);
        Fund saved = fundRepository.save(fund);
        return fundMapper.toDTO(saved);
    }

    @Transactional
    public FundDTO updateFund(Integer id, FundUpdateDTO dto) {
        Fund existing = fundRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fund not found with id: " + id));
        fundMapper.updateEntityFromDTO(dto, existing);
        Fund updated = fundRepository.save(existing);
        return fundMapper.toDTO(updated);
    }

    @Transactional
    public void deleteFund(Integer id) {
        if (!fundRepository.existsById(id)) {
            throw new ResourceNotFoundException("Fund not found with id: " + id);
        }
        fundRepository.deleteById(id);
    }

    // ========== FUND TRANSACTION ==========
    public Page<FundTransactionDTO> getTransactionsPaginated(Pageable pageable, Integer fundId, String type) {
        Specification<FundTransaction> spec = Specification.where(null);

        if (fundId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("fund").get("id"), fundId));
        }

        if (type != null && !type.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("transactionType"), type));
        }

        return fundTransactionRepository.findAll(spec, pageable)
                .map(fundMapper::toDTO);
    }

    @Transactional
    public FundTransactionDTO createTransaction(FundTransactionCreateDTO dto) {
        FundTransaction transaction = fundMapper.toEntity(dto);

        Fund fund = fundRepository.findById(dto.getFundId())
                .orElseThrow(() -> new ResourceNotFoundException("Fund not found: " + dto.getFundId()));
        transaction.setFund(fund);

        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + dto.getUserId()));
            transaction.setUser(user);
        }

        // Update Fund Balance
        BigDecimal amount = dto.getAmount();
        if ("INFLOW".equalsIgnoreCase(dto.getTransactionType()) || "TRANSFER_IN".equalsIgnoreCase(dto.getTransactionType())) {
            fund.setBalance(fund.getBalance().add(amount));
        } else if ("OUTFLOW".equalsIgnoreCase(dto.getTransactionType()) || "TRANSFER_OUT".equalsIgnoreCase(dto.getTransactionType())) {
            fund.setBalance(fund.getBalance().subtract(amount));
        }

        fundRepository.save(fund);
        FundTransaction saved = fundTransactionRepository.save(transaction);
        return fundMapper.toDTO(saved);
    }

    // ========== FUND TRANSFER ==========
    public Page<FundTransferDTO> getTransfersPaginated(Pageable pageable, Integer sourceFundId, Integer destFundId) {
        Specification<FundTransfer> spec = Specification.where(null);

        if (sourceFundId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("sourceFund").get("id"), sourceFundId));
        }

        if (destFundId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("destFund").get("id"), destFundId));
        }

        return fundTransferRepository.findAll(spec, pageable)
                .map(fundMapper::toDTO);
    }

    @Transactional
    public FundTransferDTO createTransfer(FundTransferCreateDTO dto) {
        FundTransfer transfer = fundMapper.toEntity(dto);

        Fund sourceFund = fundRepository.findById(dto.getSourceFundId())
                .orElseThrow(() -> new ResourceNotFoundException("Source Fund not found: " + dto.getSourceFundId()));
        transfer.setSourceFund(sourceFund);

        Fund destFund = fundRepository.findById(dto.getDestFundId())
                .orElseThrow(() -> new ResourceNotFoundException("Dest Fund not found: " + dto.getDestFundId()));
        transfer.setDestFund(destFund);

        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + dto.getUserId()));
            transfer.setUser(user);
        }

        if (sourceFund.getBalance().compareTo(dto.getAmount()) < 0) {
            throw new BusinessException("Insufficient balance in source fund");
        }

        // Create Transactions
        FundTransactionCreateDTO out = FundTransactionCreateDTO.builder()
                .fundId(sourceFund.getId())
                .transactionType("TRANSFER_OUT")
                .amount(dto.getAmount())
                .transactionDate(dto.getTransferDate())
                .referenceType("TRANSFER")
                .userId(dto.getUserId())
                .notes("Transfer to " + destFund.getName())
                .build();
        createTransaction(out); // Reuse logic to update balance

        FundTransactionCreateDTO in = FundTransactionCreateDTO.builder()
                .fundId(destFund.getId())
                .transactionType("TRANSFER_IN")
                .amount(dto.getAmount())
                .transactionDate(dto.getTransferDate())
                .referenceType("TRANSFER")
                .userId(dto.getUserId())
                .notes("Transfer from " + sourceFund.getName())
                .build();
        createTransaction(in); // Reuse logic to update balance

        transfer.setStatus("COMPLETED");
        FundTransfer saved = fundTransferRepository.save(transfer);
        
        return fundMapper.toDTO(saved);
    }

    // ========== EXPENSE ==========
    public Page<ExpenseDTO> getExpensesPaginated(Pageable pageable, Integer fundId, String status) {
        Specification<Expense> spec = Specification.where(null);

        if (fundId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("fund").get("id"), fundId));
        }

        if (status != null && !status.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        return expenseRepository.findAll(spec, pageable)
                .map(fundMapper::toDTO);
    }

    @Transactional
    public ExpenseDTO createExpense(ExpenseCreateDTO dto) {
        Expense expense = fundMapper.toEntity(dto);

        Fund fund = fundRepository.findById(dto.getFundId())
                .orElseThrow(() -> new ResourceNotFoundException("Fund not found: " + dto.getFundId()));
        expense.setFund(fund);

        if (dto.getApproverUserId() != null) {
            User approver = userRepository.findById(dto.getApproverUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Approver User not found: " + dto.getApproverUserId()));
            expense.setApproverUser(approver);
        }

        Expense saved = expenseRepository.save(expense);

        if ("APPROVED".equalsIgnoreCase(saved.getStatus())) {
            // Deduct from fund
            FundTransactionCreateDTO tx = FundTransactionCreateDTO.builder()
                    .fundId(fund.getId())
                    .transactionType("OUTFLOW")
                    .amount(saved.getAmount())
                    .transactionDate(saved.getExpenseDate())
                    .referenceId(saved.getId())
                    .referenceType("EXPENSE")
                    .notes(saved.getDescription())
                    .build();
            createTransaction(tx);
        }

        return fundMapper.toDTO(saved);
    }

    @Transactional
    public ExpenseDTO updateExpense(Integer id, ExpenseUpdateDTO dto) {
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        String oldStatus = existing.getStatus();
        
        fundMapper.updateEntityFromDTO(dto, existing);

        Expense updated = expenseRepository.save(existing);

        // If status changed to APPROVED, deduct balance
        if (!"APPROVED".equalsIgnoreCase(oldStatus) && "APPROVED".equalsIgnoreCase(updated.getStatus())) {
             FundTransactionCreateDTO tx = FundTransactionCreateDTO.builder()
                    .fundId(updated.getFund().getId())
                    .transactionType("OUTFLOW")
                    .amount(updated.getAmount())
                    .transactionDate(updated.getExpenseDate())
                    .referenceId(updated.getId())
                    .referenceType("EXPENSE")
                    .notes(updated.getDescription())
                    .build();
            createTransaction(tx);
        }

        return fundMapper.toDTO(updated);
    }
}
