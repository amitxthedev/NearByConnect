package com.nearbyconnect.dto;

import com.nearbyconnect.enums.ChatRoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomDto {
    private Long id;
    private String name;
    private ChatRoomType chatRoomType;
    private Long communityId;
    private String communityName;
    private int memberCount;
    private int onlineCount;
    private MessageDto lastMessage;
    private List<UserDto> members;
    private LocalDateTime createdAt;
}
