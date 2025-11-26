package com.soict.controller;

import com.soict.dto.stats.HouseholdOverviewStatsDTO;
import com.soict.dto.stats.PersonOverviewStatsDTO;
import com.soict.dto.stats.WardHouseholdStatsDTO;
import com.soict.dto.stats.WardPersonStatsDTO;
import com.soict.service.StatsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Tag(name = "Statistics", description = "Statistics APIs")
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/overview/persons")
    public PersonOverviewStatsDTO getPersonOverviewStats() {
        return statsService.getPersonOverviewStats();
    }

    @GetMapping("/overview/households")
    public HouseholdOverviewStatsDTO getHouseholdOverviewStats() {
        return statsService.countActiveHousehold();
    }

    @GetMapping("/wards/{wardId}/persons")
    public WardPersonStatsDTO getWardPersonStats(@PathVariable Integer wardId) {
        return statsService.getWardPersonStats(wardId);
    }

    @GetMapping("/wards/{wardId}/households")
    public WardHouseholdStatsDTO getWardHouseholdStats(@PathVariable Integer wardId) {
        return statsService.countActiveHouseholdByWardId(wardId);
    }
}
