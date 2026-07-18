package com.nearbyconnect.dto;

import com.nearbyconnect.enums.MessageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    @NotBlank(message = "Message content is required")
    @Size(max = 5000, message = "Message must be less than 5000 characters")
    private String content;

    private MessageType messageType;
    private Long chatRoomId;
    private Long recipientId;
}
