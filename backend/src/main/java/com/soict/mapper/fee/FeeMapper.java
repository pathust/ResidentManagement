package com.soict.mapper.fee;

import com.soict.dto.fee.*;
import com.soict.entity.fee.CollectionEvent;
import com.soict.entity.fee.FeeType;
import com.soict.entity.fee.Payment;
import com.soict.entity.fee.PaymentLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FeeMapper {

    // FeeType
    FeeTypeDTO toDTO(FeeType entity);
    FeeType toEntity(FeeTypeDTO dto);
    FeeType toEntity(FeeTypeCreateDTO dto);
    void updateEntityFromDTO(FeeTypeDTO dto, @MappingTarget FeeType entity);
    void updateEntityFromDTO(FeeTypeUpdateDTO dto, @MappingTarget FeeType entity);

    // CollectionEvent
    @Mapping(target = "feeTypeId", source = "feeType.id")
    @Mapping(target = "feeTypeName", source = "feeType.name")
    @Mapping(target = "collectorUserId", source = "collectorUser.id")
    @Mapping(target = "collectorUsername", source = "collectorUser.username")
    @Mapping(target = "approverUserId", source = "approverUser.id")
    @Mapping(target = "approverUsername", source = "approverUser.username")
    @Mapping(target = "fundId", source = "fund.id")
    @Mapping(target = "fundName", source = "fund.name")
    CollectionEventDTO toDTO(CollectionEvent entity);

    @Mapping(target = "feeType", ignore = true)
    @Mapping(target = "collectorUser", ignore = true)
    @Mapping(target = "approverUser", ignore = true)
    @Mapping(target = "fund", ignore = true)
    CollectionEvent toEntity(CollectionEventDTO dto);

    @Mapping(target = "feeType", ignore = true)
    @Mapping(target = "collectorUser", ignore = true)
    @Mapping(target = "approverUser", ignore = true)
    @Mapping(target = "fund", ignore = true)
    CollectionEvent toEntity(CollectionEventCreateDTO dto);

    @Mapping(target = "feeType", ignore = true)
    @Mapping(target = "collectorUser", ignore = true)
    @Mapping(target = "approverUser", ignore = true)
    @Mapping(target = "fund", ignore = true)
    void updateEntityFromDTO(CollectionEventUpdateDTO dto, @MappingTarget CollectionEvent entity);

    // Payment
    @Mapping(target = "collectionEventId", source = "collectionEvent.id")
    @Mapping(target = "collectionEventName", source = "collectionEvent.description")
    @Mapping(target = "householdId", source = "household.id")
    @Mapping(target = "householdCode", source = "household.code")
    @Mapping(target = "personId", source = "person.id")
    @Mapping(target = "personName", source = "person.fullName")
    @Mapping(target = "fundId", source = "fund.id")
    @Mapping(target = "fundName", source = "fund.name")
    PaymentDTO toDTO(Payment entity);

    @Mapping(target = "collectionEvent", ignore = true)
    @Mapping(target = "household", ignore = true)
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "fund", ignore = true)
    Payment toEntity(PaymentDTO dto);

    @Mapping(target = "collectionEvent", ignore = true)
    @Mapping(target = "household", ignore = true)
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "fund", ignore = true)
    Payment toEntity(PaymentCreateDTO dto);

    @Mapping(target = "collectionEvent", ignore = true)
    @Mapping(target = "household", ignore = true)
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "fund", ignore = true)
    void updateEntityFromDTO(PaymentUpdateDTO dto, @MappingTarget Payment entity);

    // PaymentLog
    @Mapping(target = "paymentId", source = "payment.id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "username", source = "user.username")
    PaymentLogDTO toDTO(PaymentLog entity);

    @Mapping(target = "payment", ignore = true)
    @Mapping(target = "user", ignore = true)
    PaymentLog toEntity(PaymentLogDTO dto);
}
