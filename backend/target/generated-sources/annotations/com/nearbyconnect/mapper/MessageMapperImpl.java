package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.MessageDto;
import com.nearbyconnect.entity.Message;
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
public class MessageMapperImpl implements MessageMapper {

    @Override
    public MessageDto toDto(Message message) {
        if ( message == null ) {
            return null;
        }

        MessageDto.MessageDtoBuilder messageDto = MessageDto.builder();

        messageDto.content( message.getContent() );
        messageDto.createdAt( message.getCreatedAt() );
        messageDto.id( message.getId() );
        messageDto.messageType( message.getMessageType() );

        messageDto.senderName( message.getSender() != null ? message.getSender().getAnonymousName() : null );
        messageDto.senderAvatar( message.getSender() != null ? message.getSender().getAnonymousAvatar() : null );
        messageDto.senderId( message.getSender() != null ? message.getSender().getId() : null );

        return messageDto.build();
    }

    @Override
    public List<MessageDto> toDtoList(List<Message> messages) {
        if ( messages == null ) {
            return null;
        }

        List<MessageDto> list = new ArrayList<MessageDto>( messages.size() );
        for ( Message message : messages ) {
            list.add( toDto( message ) );
        }

        return list;
    }
}
