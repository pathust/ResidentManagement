package com.soict.service;

import com.soict.dto.fee.*;
import com.soict.entity.fee.CollectionEvent;
import com.soict.entity.fee.FeeType;
import com.soict.entity.fee.Payment;
import com.soict.entity.fee.PaymentLog;
import com.soict.entity.fund.Fund;
import com.soict.entity.household.Household;
import com.soict.entity.person.Person;
import com.soict.entity.user.User;
import com.soict.exception.BusinessException;
import com.soict.exception.ResourceNotFoundException;
import com.soict.mapper.fee.FeeMapper;
import com.soict.repository.fee.CollectionEventRepository;
import com.soict.repository.fee.FeeTypeRepository;
import com.soict.repository.fee.PaymentLogRepository;
import com.soict.repository.fee.PaymentRepository;
import com.soict.repository.fund.FundRepository;
import com.soict.repository.household.HouseholdRepository;
import com.soict.repository.person.PersonRepository;
import com.soict.repository.user.UserRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FeeService {
    private final FeeTypeRepository feeTypeRepository;
    private final CollectionEventRepository collectionEventRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentLogRepository paymentLogRepository;
    private final FeeMapper feeMapper;
    private final UserRepository userRepository;
    private final FundRepository fundRepository;
    private final HouseholdRepository householdRepository;
    private final PersonRepository personRepository;

    // ========== FEE TYPE ==========
    public List<FeeTypeDTO> getAllFeeTypes() {
        return feeTypeRepository.findAll().stream()
                .map(feeMapper::toDTO)
                .collect(Collectors.toList());
    }

    public FeeTypeDTO getFeeTypeById(Integer id) {
        FeeType feeType = feeTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FeeType not found with id: " + id));
        return feeMapper.toDTO(feeType);
    }

    @Transactional
    public FeeTypeDTO createFeeType(FeeTypeCreateDTO dto) {
        FeeType feeType = feeMapper.toEntity(dto);
        FeeType saved = feeTypeRepository.save(feeType);
        return feeMapper.toDTO(saved);
    }

    @Transactional
    public FeeTypeDTO updateFeeType(Integer id, FeeTypeUpdateDTO dto) {
        FeeType existing = feeTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FeeType not found with id: " + id));
        feeMapper.updateEntityFromDTO(dto, existing);
        FeeType updated = feeTypeRepository.save(existing);
        return feeMapper.toDTO(updated);
    }

    @Transactional
    public void deleteFeeType(Integer id) {
        if (!feeTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException("FeeType not found with id: " + id);
        }
        // Check for dependencies (CollectionEvents) - handled by DB constraints usually, but good to check
        feeTypeRepository.deleteById(id);
    }

    // ========== COLLECTION EVENT ==========
    public Page<CollectionEventDTO> getCollectionEventsPaginated(Pageable pageable, String status, Integer feeTypeId) {
        Specification<CollectionEvent> spec = Specification.where(null);

        if (status != null && !status.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        if (feeTypeId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("feeType").get("id"), feeTypeId));
        }

        return collectionEventRepository.findAll(spec, pageable)
                .map(feeMapper::toDTO);
    }

    public CollectionEventDTO getCollectionEventById(Integer id) {
        CollectionEvent event = collectionEventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CollectionEvent not found with id: " + id));
        return feeMapper.toDTO(event);
    }

    @Transactional
    public CollectionEventDTO createCollectionEvent(CollectionEventCreateDTO dto) {
        CollectionEvent event = feeMapper.toEntity(dto);

        FeeType feeType = feeTypeRepository.findById(dto.getFeeTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("FeeType not found: " + dto.getFeeTypeId()));
        event.setFeeType(feeType);

        User collector = userRepository.findById(dto.getCollectorUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Collector User not found: " + dto.getCollectorUserId()));
        event.setCollectorUser(collector);

        if (dto.getFundId() != null) {
            Fund fund = fundRepository.findById(dto.getFundId())
                    .orElseThrow(() -> new ResourceNotFoundException("Fund not found: " + dto.getFundId()));
            event.setFund(fund);
        }

        CollectionEvent saved = collectionEventRepository.save(event);
        return feeMapper.toDTO(saved);
    }

    @Transactional
    public CollectionEventDTO updateCollectionEvent(Integer id, CollectionEventUpdateDTO dto) {
        CollectionEvent existing = collectionEventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CollectionEvent not found with id: " + id));

        feeMapper.updateEntityFromDTO(dto, existing);

        if (dto.getApproverUserId() != null) {
            User approver = userRepository.findById(dto.getApproverUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Approver User not found: " + dto.getApproverUserId()));
            existing.setApproverUser(approver);
        }

        if (dto.getFundId() != null) {
            Fund fund = fundRepository.findById(dto.getFundId())
                    .orElseThrow(() -> new ResourceNotFoundException("Fund not found: " + dto.getFundId()));
            existing.setFund(fund);
        }

        CollectionEvent updated = collectionEventRepository.save(existing);
        return feeMapper.toDTO(updated);
    }

    @Transactional
    public void deleteCollectionEvent(Integer id) {
        if (!collectionEventRepository.existsById(id)) {
            throw new ResourceNotFoundException("CollectionEvent not found with id: " + id);
        }
        collectionEventRepository.deleteById(id);
    }

    // ========== PAYMENT ==========
    public Page<PaymentDTO> getPaymentsPaginated(Pageable pageable, Integer collectionEventId, Integer householdId, String status) {
        Specification<Payment> spec = Specification.where(null);

        if (collectionEventId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("collectionEvent").get("id"), collectionEventId));
        }

        if (householdId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("household").get("id"), householdId));
        }

        if (status != null && !status.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        return paymentRepository.findAll(spec, pageable)
                .map(feeMapper::toDTO);
    }

    public PaymentDTO getPaymentById(Integer id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return feeMapper.toDTO(payment);
    }

    @Transactional
    public PaymentDTO createPayment(PaymentCreateDTO dto) {
        Payment payment = feeMapper.toEntity(dto);

        CollectionEvent event = collectionEventRepository.findById(dto.getCollectionEventId())
                .orElseThrow(() -> new ResourceNotFoundException("CollectionEvent not found: " + dto.getCollectionEventId()));
        payment.setCollectionEvent(event);

        Household household = householdRepository.findById(dto.getHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException("Household not found: " + dto.getHouseholdId()));
        payment.setHousehold(household);

        if (dto.getPersonId() != null) {
            Person person = personRepository.findById(dto.getPersonId())
                    .orElseThrow(() -> new ResourceNotFoundException("Person not found: " + dto.getPersonId()));
            payment.setPerson(person);
        }

        if (dto.getFundId() != null) {
            Fund fund = fundRepository.findById(dto.getFundId())
                    .orElseThrow(() -> new ResourceNotFoundException("Fund not found: " + dto.getFundId()));
            payment.setFund(fund);
        } else if (event.getFund() != null) {
            payment.setFund(event.getFund());
        }

        Payment saved = paymentRepository.save(payment);
        return feeMapper.toDTO(saved);
    }

    @Transactional
    public PaymentDTO updatePayment(Integer id, PaymentUpdateDTO dto) {
        Payment existing = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        feeMapper.updateEntityFromDTO(dto, existing);

        Payment updated = paymentRepository.save(existing);
        return feeMapper.toDTO(updated);
    }
}
