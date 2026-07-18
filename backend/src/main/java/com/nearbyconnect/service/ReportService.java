package com.nearbyconnect.service;

import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.dto.ReportRequest;
import com.nearbyconnect.entity.Report;
import com.nearbyconnect.enums.ReportStatus;

public interface ReportService {
    void createReport(ReportRequest request);
    PageResponse<Report> getReportsByStatus(ReportStatus status, int page, int size);
    PageResponse<Report> getAllReports(int page, int size);
    void resolveReport(Long reportId, Long reviewedBy);
    void dismissReport(Long reportId, Long reviewedBy);
}
