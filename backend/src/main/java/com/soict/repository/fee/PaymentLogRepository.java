package com.soict.repository.fee;

import com.soict.entity.fee.PaymentLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentLogRepository extends JpaRepository<PaymentLog, Integer> {
    List<PaymentLog> findByPaymentIdOrderByChangeDateDesc(Integer paymentId);
}
