package com.nearbyconnect.service.impl;

import com.nearbyconnect.dto.ChatRoomDto;
import com.nearbyconnect.dto.MessageDto;
import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.dto.SendMessageRequest;
import com.nearbyconnect.entity.ChatRoom;
import com.nearbyconnect.entity.ChatRoomMember;
import com.nearbyconnect.entity.Community;
import com.nearbyconnect.entity.Message;
import com.nearbyconnect.entity.User;
import com.nearbyconnect.enums.ChatRoomType;
import com.nearbyconnect.enums.MessageType;
import com.nearbyconnect.mapper.ChatRoomMapper;
import com.nearbyconnect.mapper.MessageMapper;
import com.nearbyconnect.repository.ChatRoomMemberRepository;
import com.nearbyconnect.repository.ChatRoomRepository;
import com.nearbyconnect.repository.CommunityRepository;
import com.nearbyconnect.repository.MessageRepository;
import com.nearbyconnect.repository.UserRepository;
import com.nearbyconnect.security.SecurityUtils;
import com.nearbyconnect.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ChatServiceImpl implements ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final ChatRoomMapper chatRoomMapper;
    private final MessageMapper messageMapper;

    @Override
    public List<ChatRoomDto> getUserChatRooms() {
        Long userId = getCurrentUserId();
        List<ChatRoom> chatRooms = chatRoomRepository.findByMemberUserId(userId);
        return chatRooms.stream()
                .map(this::enrichChatRoom)
                .collect(Collectors.toList());
    }

    @Override
    public ChatRoomDto getChatRoomById(Long id) {
        ChatRoom chatRoom = chatRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        return enrichChatRoom(chatRoom);
    }

    @Override
    @Transactional
    public ChatRoomDto getOrCreatePrivateChatRoom(Long recipientId) {
        Long userId = getCurrentUserId();
        return chatRoomRepository.findPrivateChatRoom(userId, recipientId)
                .map(this::enrichChatRoom)
                .orElseGet(() -> {
                    ChatRoom chatRoom = ChatRoom.builder()
                            .chatRoomType(ChatRoomType.PRIVATE)
                            .memberCount(2)
                            .build();
                    chatRoom = chatRoomRepository.save(chatRoom);

                    User user1 = userRepository.getReferenceById(userId);
                    User user2 = userRepository.getReferenceById(recipientId);

                    chatRoomMemberRepository.save(ChatRoomMember.builder()
                            .chatRoom(chatRoom).user(user1).joinedAt(LocalDateTime.now()).build());
                    chatRoomMemberRepository.save(ChatRoomMember.builder()
                            .chatRoom(chatRoom).user(user2).joinedAt(LocalDateTime.now()).build());

                    return enrichChatRoom(chatRoom);
                });
    }

    @Override
    @Transactional
    public ChatRoomDto createCommunityChatRoom(Long communityId) {
        Long userId = getCurrentUserId();
        User currentUser = userRepository.getReferenceById(userId);
        Community community = communityRepository.getReferenceById(communityId);

        Optional<ChatRoom> existingRoom = chatRoomRepository.findFirstByCommunityIdOrderByIdAsc(communityId);
        if (existingRoom.isPresent()) {
            ChatRoom room = existingRoom.get();
            if (!chatRoomMemberRepository.existsByChatRoomIdAndUserId(room.getId(), userId)) {
                chatRoomMemberRepository.save(ChatRoomMember.builder()
                        .chatRoom(room).user(currentUser).joinedAt(LocalDateTime.now()).build());
                room.setMemberCount(room.getMemberCount() + 1);
                chatRoomRepository.save(room);
            }
            return enrichChatRoom(room);
        }

        ChatRoom chatRoom = ChatRoom.builder()
                .chatRoomType(ChatRoomType.COMMUNITY)
                .createdBy(currentUser)
                .community(community)
                .name(community.getName())
                .memberCount(1)
                .build();
        chatRoom = chatRoomRepository.save(chatRoom);

        chatRoomMemberRepository.save(ChatRoomMember.builder()
                .chatRoom(chatRoom).user(currentUser).joinedAt(LocalDateTime.now()).build());

        return enrichChatRoom(chatRoom);
    }

    @Override
    @Transactional
    public MessageDto sendMessage(SendMessageRequest request) {
        Long userId = getCurrentUserId();
        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatRoom chatRoom;
        if (request.getChatRoomId() != null) {
            chatRoom = chatRoomRepository.findById(request.getChatRoomId())
                    .orElseThrow(() -> new RuntimeException("Chat room not found"));
        } else if (request.getRecipientId() != null) {
            chatRoom = chatRoomRepository.findPrivateChatRoom(userId, request.getRecipientId())
                    .orElseGet(() -> {
                        ChatRoom newRoom = ChatRoom.builder()
                                .chatRoomType(ChatRoomType.PRIVATE)
                                .memberCount(2)
                                .build();
                        newRoom = chatRoomRepository.save(newRoom);
                        chatRoomMemberRepository.save(ChatRoomMember.builder()
                                .chatRoom(newRoom).user(sender).joinedAt(LocalDateTime.now()).build());
                        User recipient = userRepository.getReferenceById(request.getRecipientId());
                        chatRoomMemberRepository.save(ChatRoomMember.builder()
                                .chatRoom(newRoom).user(recipient).joinedAt(LocalDateTime.now()).build());
                        return newRoom;
                    });
        } else {
            throw new RuntimeException("Chat room ID or recipient ID required");
        }

        Message message = Message.builder()
                .content(request.getContent())
                .messageType(request.getMessageType() != null ? request.getMessageType() : MessageType.TEXT)
                .sender(sender)
                .chatRoom(chatRoom)
                .build();

        message = messageRepository.save(message);
        log.info("Message sent in room {} by {}", chatRoom.getId(), sender.getAnonymousName());
        return messageMapper.toDto(message);
    }

    @Override
    public PageResponse<MessageDto> getMessages(Long chatRoomId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findByChatRoomIdOrderByCreatedAtDesc(chatRoomId, pageable);
        List<MessageDto> dtos = messageMapper.toDtoList(new ArrayList<>(messages.getContent()));
        return PageResponse.<MessageDto>builder()
                .content(dtos)
                .page(messages.getNumber())
                .size(messages.getSize())
                .totalElements(messages.getTotalElements())
                .totalPages(messages.getTotalPages())
                .isFirst(messages.isFirst())
                .isLast(messages.isLast())
                .build();
    }

    @Override
    public List<MessageDto> getPinnedMessages(Long chatRoomId) {
        List<Message> pinned = messageRepository.findByChatRoomIdAndIsPinnedTrue(chatRoomId);
        return messageMapper.toDtoList(pinned);
    }

    @Override
    @Transactional
    public MessageDto editMessage(Long messageId, String content) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        if (!message.getSender().getId().equals(getCurrentUserId())) {
            throw new RuntimeException("Not authorized");
        }
        message.setContent(content);
        message.setEdited(true);
        message = messageRepository.save(message);
        return messageMapper.toDto(message);
    }

    @Override
    @Transactional
    public void deleteMessage(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        if (!message.getSender().getId().equals(getCurrentUserId())) {
            throw new RuntimeException("Not authorized");
        }
        message.setContent("This message has been deleted");
        message.setDeleted(true);
        messageRepository.save(message);
    }

    @Override
    @Transactional
    public void pinMessage(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setPinned(true);
        messageRepository.save(message);
    }

    @Override
    @Transactional
    public void unpinMessage(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setPinned(false);
        messageRepository.save(message);
    }

    @Override
    @Transactional
    public void markAsRead(Long chatRoomId) {
        Long userId = getCurrentUserId();
        ChatRoomMember member = chatRoomMemberRepository.findByChatRoomIdAndUserId(chatRoomId, userId)
                .orElseThrow(() -> new RuntimeException("Not a member"));
        member.setLastReadAt(LocalDateTime.now());
        chatRoomMemberRepository.save(member);
    }

    @Override
    public List<Long> getOnlineUsers(Long chatRoomId) {
        return chatRoomMemberRepository.findOnlineUserIdsByChatRoomId(chatRoomId);
    }

    private Long getCurrentUserId() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("User not authenticated");
        }
        return userId;
    }

    private ChatRoomDto enrichChatRoom(ChatRoom chatRoom) {
        ChatRoomDto dto = chatRoomMapper.toDto(chatRoom);
        List<Long> onlineIds = chatRoomMemberRepository.findOnlineUserIdsByChatRoomId(chatRoom.getId());
        dto.setOnlineCount(onlineIds.size());
        MessageDto lastMsg = messageRepository.findFirstByChatRoomIdOrderByCreatedAtDesc(chatRoom.getId())
                .map(messageMapper::toDto)
                .orElse(null);
        dto.setLastMessage(lastMsg);
        return dto;
    }
}
