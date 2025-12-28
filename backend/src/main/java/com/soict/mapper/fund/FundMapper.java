package com.soict.mapper.fund;

import com.soict.dto.fund.*;
import com.soict.entity.fund.Expense;
import com.soict.entity.fund.Fund;
import com.soict.entity.fund.FundTransaction;
import com.soict.entity.fund.FundTransfer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FundMapper {

    // Fund
    FundDTO toDTO(Fund entity);
    Fund toEntity(FundDTO dto);
    Fund toEntity(FundCreateDTO dto);
    void updateEntityFromDTO(FundDTO dto, @MappingTarget Fund entity);
    void updateEntityFromDTO(FundUpdateDTO dto, @MappingTarget Fund entity);

    // FundTransaction
    @Mapping(target = "fundId", source = "fund.id")
    @Mapping(target = "fundName", source = "fund.name")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "username", source = "user.username")
    FundTransactionDTO toDTO(FundTransaction entity);

    @Mapping(target = "fund", ignore = true)
    @Mapping(target = "user", ignore = true)
    FundTransaction toEntity(FundTransactionDTO dto);

    @Mapping(target = "fund", ignore = true)
    @Mapping(target = "user", ignore = true)
    FundTransaction toEntity(FundTransactionCreateDTO dto);

    // FundTransfer
    @Mapping(target = "sourceFundId", source = "sourceFund.id")
    @Mapping(target = "sourceFundName", source = "sourceFund.name")
    @Mapping(target = "destFundId", source = "destFund.id")
    @Mapping(target = "destFundName", source = "destFund.name")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "username", source = "user.username")
    FundTransferDTO toDTO(FundTransfer entity);

    @Mapping(target = "sourceFund", ignore = true)
    @Mapping(target = "destFund", ignore = true)
    @Mapping(target = "user", ignore = true)
    FundTransfer toEntity(FundTransferDTO dto);

    @Mapping(target = "sourceFund", ignore = true)
    @Mapping(target = "destFund", ignore = true)
    @Mapping(target = "user", ignore = true)
    FundTransfer toEntity(FundTransferCreateDTO dto);

    // Expense
    @Mapping(target = "fundId", source = "fund.id")
    @Mapping(target = "fundName", source = "fund.name")
    @Mapping(target = "approverUserId", source = "approverUser.id")
    @Mapping(target = "approverUsername", source = "approverUser.username")
    ExpenseDTO toDTO(Expense entity);

    @Mapping(target = "fund", ignore = true)
    @Mapping(target = "approverUser", ignore = true)
    Expense toEntity(ExpenseDTO dto);

    @Mapping(target = "fund", ignore = true)
    @Mapping(target = "approverUser", ignore = true)
    Expense toEntity(ExpenseCreateDTO dto);

    @Mapping(target = "fund", ignore = true)
    @Mapping(target = "approverUser", ignore = true)
    void updateEntityFromDTO(ExpenseUpdateDTO dto, @MappingTarget Expense entity);
}
