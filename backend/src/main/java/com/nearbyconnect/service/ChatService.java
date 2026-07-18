package com.nearbyconnect.service;

import com.nearbyconnect.dto.ChatRoomDto;
import com.nearbyconnect.dto.MessageDto;
import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.dto.SendMessageRequest;
import java.util.List;

public interface ChatService {
    List<ChatRoomDto> getUserChatRooms();
    ChatRoomDto getChatRoomById(Long id);
    ChatRoomDto getOrCreatePrivateChatRoom(Long recipientId);
    ChatRoomDto createCommunityChatRoom(Long communityId);
    MessageDto sendMessage(SendMessageRequest request);
    PageResponse<MessageDto> getMessages(Long chatRoomId, int page, int size);
    List<MessageDto> getPinnedMessages(Long chatRoomId);
    MessageDto editMessage(Long messageId, String content);
    void deleteMessage(Long messageId);
    void pinMessage(Long messageId);
    void unpinMessage(Long messageId);
    void markAsRead(Long chatRoomId);
    List<Long> getOnlineUsers(Long chatRoomId);
}
