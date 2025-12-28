package com.soict.repository.fund;

import com.soict.entity.fund.FundTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FundTransferRepository extends JpaRepository<FundTransfer, Integer>, JpaSpecificationExecutor<FundTransfer> {
}
