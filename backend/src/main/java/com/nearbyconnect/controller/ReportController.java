package com.nearbyconnect.controller;

import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.dto.ReportRequest;
import com.nearbyconnect.entity.Report;
import com.nearbyconnect.enums.ReportStatus;
import com.nearbyconnect.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<Void> createReport(@Valid @RequestBody ReportRequest request) {
        reportService.createReport(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<PageResponse<Report>> getAllReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(reportService.getAllReports(page, size));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<PageResponse<Report>> getReportsByStatus(
            @PathVariable ReportStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(reportService.getReportsByStatus(status, page, size));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Void> resolveReport(@PathVariable Long id) {
        reportService.resolveReport(id, 1L);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/dismiss")
    public ResponseEntity<Void> dismissReport(@PathVariable Long id) {
        reportService.dismissReport(id, 1L);
        return ResponseEntity.ok().build();
    }
}
