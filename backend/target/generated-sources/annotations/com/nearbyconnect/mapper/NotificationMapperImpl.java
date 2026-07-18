package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.NotificationDto;
import com.nearbyconnect.entity.Notification;
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
public class NotificationMapperImpl implements NotificationMapper {

    @Override
    public NotificationDto toDto(Notification notification) {
        if ( notification == null ) {
            return null;
        }

        NotificationDto.NotificationDtoBuilder notificationDto = NotificationDto.builder();

        notificationDto.createdAt( notification.getCreatedAt() );
        notificationDto.id( notification.getId() );
        notificationDto.message( notification.getMessage() );
        notificationDto.notificationType( notification.getNotificationType() );
        notificationDto.referenceId( notification.getReferenceId() );
        notificationDto.referenceType( notification.getReferenceType() );

        notificationDto.senderName( notification.getSender() != null ? notification.getSender().getAnonymousName() : null );
        notificationDto.senderAvatar( notification.getSender() != null ? notification.getSender().getAnonymousAvatar() : null );
        notificationDto.senderId( notification.getSender() != null ? notification.getSender().getId() : null );
        notificationDto.type( notification.getNotificationType() != null ? notification.getNotificationType().name().toLowerCase() : null );
        notificationDto.actor( notification.getSender() != null ? notification.getSender().getAnonymousName() : null );
        notificationDto.actorEmoji( getActorEmoji(notification) );

        return notificationDto.build();
    }

    @Override
    public List<NotificationDto> toDtoList(List<Notification> notifications) {
        if ( notifications == null ) {
            return null;
        }

        List<NotificationDto> list = new ArrayList<NotificationDto>( notifications.size() );
        for ( Notification notification : notifications ) {
            list.add( toDto( notification ) );
        }

        return list;
    }
}
