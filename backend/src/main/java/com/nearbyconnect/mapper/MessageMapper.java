package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.MessageDto;
import com.nearbyconnect.entity.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface MessageMapper {
    @Mapping(target = "senderName", expression = "java(message.getSender() != null ? message.getSender().getAnonymousName() : null)")
    @Mapping(target = "senderAvatar", expression = "java(message.getSender() != null ? message.getSender().getAnonymousAvatar() : null)")
    @Mapping(target = "senderId", expression = "java(message.getSender() != null ? message.getSender().getId() : null)")
    MessageDto toDto(Message message);

    List<MessageDto> toDtoList(List<Message> messages);
}
