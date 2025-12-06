package com.soict.repository.fund;

import com.soict.entity.fund.FundTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FundTransactionRepository extends JpaRepository<FundTransaction, Integer>, JpaSpecificationExecutor<FundTransaction> {
    List<FundTransaction> findByFundIdOrderByTransactionDateDesc(Integer fundId);
}
