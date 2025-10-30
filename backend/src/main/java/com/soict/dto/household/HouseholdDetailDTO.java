package com.soict.dto.household;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdDetailDTO {
    private Integer id;
    private Integer wardId;
    private String wardName;
    private String provinceName;
    private String houseAddressDetails;
    private String code;
    private Integer headPersonId;
    private String headPersonName;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<HouseholdMemberDTO> members;
}
