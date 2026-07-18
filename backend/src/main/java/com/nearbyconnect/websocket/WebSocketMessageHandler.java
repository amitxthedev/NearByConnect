package com.nearbyconnect.websocket;

import com.nearbyconnect.dto.SendMessageRequest;
import com.nearbyconnect.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketMessageHandler {

    private final ChatService chatService;

    @MessageMapping("/chat/{chatRoomId}/send")
    @SendTo("/topic/chat/{chatRoomId}")
    public Map<String, Object> sendMessage(@DestinationVariable Long chatRoomId, @Payload SendMessageRequest request) {
        request.setChatRoomId(chatRoomId);
        var message = chatService.sendMessage(request);
        return Map.of("type", "MESSAGE", "data", message);
    }

    @MessageMapping("/chat/{chatRoomId}/typing")
    @SendTo("/topic/chat/{chatRoomId}/typing")
    public Map<String, Object> typingIndicator(@DestinationVariable Long chatRoomId, @Payload Map<String, Object> payload) {
        return Map.of("type", "TYPING", "userId", payload.get("userId"), "isTyping", payload.getOrDefault("isTyping", true));
    }

    @MessageMapping("/chat/{chatRoomId}/read")
    @SendTo("/topic/chat/{chatRoomId}/read")
    public Map<String, Object> readReceipt(@DestinationVariable Long chatRoomId, @Payload Map<String, Object> payload) {
        chatService.markAsRead(chatRoomId);
        return Map.of("type", "READ", "userId", payload.get("userId"));
    }
}
