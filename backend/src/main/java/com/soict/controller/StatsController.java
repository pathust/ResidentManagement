package com.soict.controller;

import com.soict.dto.stats.PersonOverviewStatsDTO;
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

    @GetMapping("/overview")
    public PersonOverviewStatsDTO getOverviewStats() {
        return statsService.getPersonOverviewStats();
    }

    @GetMapping("/wards/{wardId}")
    public WardPersonStatsDTO getWardStats(@PathVariable Integer wardId) {
        return statsService.getWardPersonStats(wardId);
    }
}
