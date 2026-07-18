package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.ChatRoomDto;
import com.nearbyconnect.entity.ChatRoom;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-18T03:35:37+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class ChatRoomMapperImpl implements ChatRoomMapper {

    @Override
    public ChatRoomDto toDto(ChatRoom chatRoom) {
        if ( chatRoom == null ) {
            return null;
        }

        ChatRoomDto.ChatRoomDtoBuilder chatRoomDto = ChatRoomDto.builder();

        chatRoomDto.chatRoomType( chatRoom.getChatRoomType() );
        chatRoomDto.createdAt( chatRoom.getCreatedAt() );
        chatRoomDto.id( chatRoom.getId() );
        chatRoomDto.memberCount( chatRoom.getMemberCount() );
        chatRoomDto.name( chatRoom.getName() );

        chatRoomDto.communityId( chatRoom.getCommunity() != null ? chatRoom.getCommunity().getId() : null );
        chatRoomDto.communityName( chatRoom.getCommunity() != null ? chatRoom.getCommunity().getName() : null );

        return chatRoomDto.build();
    }

    @Override
    public List<ChatRoomDto> toDtoList(List<ChatRoom> chatRooms) {
        if ( chatRooms == null ) {
            return null;
        }

        List<ChatRoomDto> list = new ArrayList<ChatRoomDto>( chatRooms.size() );
        for ( ChatRoom chatRoom : chatRooms ) {
            list.add( toDto( chatRoom ) );
        }

        return list;
    }
}
