package com.nearbyconnect.controller;

import com.nearbyconnect.dto.DashboardDto;
import com.nearbyconnect.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardDto> getDashboard(@RequestParam Long cityId) {
        return ResponseEntity.ok(dashboardService.getDashboard(cityId));
    }
}
