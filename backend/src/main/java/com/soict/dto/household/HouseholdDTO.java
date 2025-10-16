package com.soict.dto.household;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdDTO {
    private Integer id;
    private String code;

    // Ward information
    private Integer wardId;
    private String wardName;
    private String districtName;
    private String provinceName;

    // Address details
    private String houseAddressDetails;
    private String fullAddress; // Computed: houseAddressDetails + ward + district + province

    // Metadata
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Household statistics (optional)
    private Integer totalMembers;
    private Integer activeMembers;
    private String householdHeadName;
    private Integer householdHeadId;
}