package com.nearbyconnect.controller;

import com.nearbyconnect.dto.ChatRoomDto;
import com.nearbyconnect.dto.MessageDto;
import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.dto.SendMessageRequest;
import com.nearbyconnect.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomDto>> getUserChatRooms() {
        return ResponseEntity.ok(chatService.getUserChatRooms());
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<ChatRoomDto> getChatRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(chatService.getChatRoomById(id));
    }

    @PostMapping("/rooms/private/{recipientId}")
    public ResponseEntity<ChatRoomDto> getOrCreatePrivateRoom(@PathVariable Long recipientId) {
        return ResponseEntity.ok(chatService.getOrCreatePrivateChatRoom(recipientId));
    }

    @PostMapping("/rooms/community/{communityId}")
    public ResponseEntity<ChatRoomDto> createCommunityRoom(@PathVariable Long communityId) {
        return ResponseEntity.ok(chatService.createCommunityChatRoom(communityId));
    }

    @PostMapping("/messages")
    public ResponseEntity<MessageDto> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(chatService.sendMessage(request));
    }

    @GetMapping("/rooms/{chatRoomId}/messages")
    public ResponseEntity<PageResponse<MessageDto>> getMessages(
            @PathVariable Long chatRoomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(chatService.getMessages(chatRoomId, page, size));
    }

    @GetMapping("/rooms/{chatRoomId}/pinned")
    public ResponseEntity<List<MessageDto>> getPinnedMessages(@PathVariable Long chatRoomId) {
        return ResponseEntity.ok(chatService.getPinnedMessages(chatRoomId));
    }

    @PutMapping("/messages/{messageId}")
    public ResponseEntity<MessageDto> editMessage(
            @PathVariable Long messageId,
            @RequestBody String content) {
        return ResponseEntity.ok(chatService.editMessage(messageId, content));
    }

    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long messageId) {
        chatService.deleteMessage(messageId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/messages/{messageId}/pin")
    public ResponseEntity<Void> pinMessage(@PathVariable Long messageId) {
        chatService.pinMessage(messageId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/messages/{messageId}/pin")
    public ResponseEntity<Void> unpinMessage(@PathVariable Long messageId) {
        chatService.unpinMessage(messageId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/rooms/{chatRoomId}/online")
    public ResponseEntity<List<Long>> getOnlineUsers(@PathVariable Long chatRoomId) {
        return ResponseEntity.ok(chatService.getOnlineUsers(chatRoomId));
    }
}
