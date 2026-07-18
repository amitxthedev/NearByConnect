package com.nearbyconnect.service.impl;

import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.dto.ReportRequest;
import com.nearbyconnect.entity.Report;
import com.nearbyconnect.entity.User;
import com.nearbyconnect.enums.ReportStatus;
import com.nearbyconnect.repository.CommentRepository;
import com.nearbyconnect.repository.PostRepository;
import com.nearbyconnect.repository.ReportRepository;
import com.nearbyconnect.repository.UserRepository;
import com.nearbyconnect.security.SecurityUtils;
import com.nearbyconnect.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    @Override
    @Transactional
    public void createReport(ReportRequest request) {
        Long userId = getCurrentUserId();
        User reporter = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Report report = Report.builder()
                .reporter(reporter)
                .reason(request.getReason())
                .description(request.getDescription())
                .status(ReportStatus.PENDING)
                .build();

        Long postId = request.getPostId();
        Long commentId = request.getCommentId();
        Long reportedUserId = request.getReportedUserId();

        if (postId == null && commentId == null && reportedUserId == null && request.getTargetType() != null && request.getTargetId() != null) {
            switch (request.getTargetType().toUpperCase()) {
                case "POST" -> postId = request.getTargetId();
                case "COMMENT" -> commentId = request.getTargetId();
                case "USER" -> reportedUserId = request.getTargetId();
            }
        }

        if (postId != null) {
            report.setPost(postRepository.getReferenceById(postId));
        }
        if (commentId != null) {
            report.setComment(commentRepository.getReferenceById(commentId));
        }
        if (reportedUserId != null) {
            report.setReportedUser(userRepository.getReferenceById(reportedUserId));
        }

        reportRepository.save(report);
        log.info("Report created by user {} for reason {}", reporter.getAnonymousName(), request.getReason());
    }

    @Override
    public PageResponse<Report> getReportsByStatus(ReportStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Report> reports = reportRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        return PageResponse.<Report>builder()
                .content(reports.getContent())
                .page(reports.getNumber())
                .size(reports.getSize())
                .totalElements(reports.getTotalElements())
                .totalPages(reports.getTotalPages())
                .isFirst(reports.isFirst())
                .isLast(reports.isLast())
                .build();
    }

    @Override
    public PageResponse<Report> getAllReports(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Report> reports = reportRepository.findAllByOrderByCreatedAtDesc(pageable);
        return PageResponse.<Report>builder()
                .content(reports.getContent())
                .page(reports.getNumber())
                .size(reports.getSize())
                .totalElements(reports.getTotalElements())
                .totalPages(reports.getTotalPages())
                .isFirst(reports.isFirst())
                .isLast(reports.isLast())
                .build();
    }

    @Override
    @Transactional
    public void resolveReport(Long reportId, Long reviewedBy) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(ReportStatus.RESOLVED);
        if (reviewedBy != null) {
            report.setReviewedBy(userRepository.getReferenceById(reviewedBy));
        }
        reportRepository.save(report);
    }

    @Override
    @Transactional
    public void dismissReport(Long reportId, Long reviewedBy) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(ReportStatus.DISMISSED);
        if (reviewedBy != null) {
            report.setReviewedBy(userRepository.getReferenceById(reviewedBy));
        }
        reportRepository.save(report);
    }

    private Long getCurrentUserId() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("User not authenticated");
        }
        return userId;
    }
}
