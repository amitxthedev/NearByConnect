package com.nearbyconnect.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nearbyconnect.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private Long id;
    private String content;
    private MessageType messageType;
    private String senderName;
    private String senderAvatar;
    private Long senderId;
    private Long chatRoomId;
    @JsonProperty("isEdited")
    private boolean isEdited;
    @JsonProperty("isDeleted")
    private boolean isDeleted;
    @JsonProperty("isPinned")
    private boolean isPinned;
    private LocalDateTime createdAt;
}
