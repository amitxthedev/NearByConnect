package com.nearbyconnect.dto;

import com.nearbyconnect.enums.ReportReason;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequest {
    private ReportReason reason;
    private String description;
    private Long postId;
    private Long commentId;
    private Long reportedUserId;
    private String targetType;
    private Long targetId;
}
