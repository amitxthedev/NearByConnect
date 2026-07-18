package com.nearbyconnect.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nearbyconnect.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long id;
    private NotificationType notificationType;
    private String type;
    private String senderName;
    private String senderAvatar;
    private String actorEmoji;
    private String actor;
    private Long senderId;
    private String message;
    private Long referenceId;
    private String referenceType;
    @JsonProperty("isRead")
    private boolean isRead;
    private LocalDateTime createdAt;
}
