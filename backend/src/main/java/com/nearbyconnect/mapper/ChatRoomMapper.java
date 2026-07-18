package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.ChatRoomDto;
import com.nearbyconnect.entity.ChatRoom;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring", uses = {MessageMapper.class, UserMapper.class})
public interface ChatRoomMapper {
    @Mapping(target = "communityId", expression = "java(chatRoom.getCommunity() != null ? chatRoom.getCommunity().getId() : null)")
    @Mapping(target = "communityName", expression = "java(chatRoom.getCommunity() != null ? chatRoom.getCommunity().getName() : null)")
    @Mapping(target = "lastMessage", ignore = true)
    @Mapping(target = "members", ignore = true)
    @Mapping(target = "onlineCount", ignore = true)
    ChatRoomDto toDto(ChatRoom chatRoom);

    List<ChatRoomDto> toDtoList(List<ChatRoom> chatRooms);
}
