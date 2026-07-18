package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.NotificationDto;
import com.nearbyconnect.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface NotificationMapper {
    @Mapping(target = "senderName", expression = "java(notification.getSender() != null ? notification.getSender().getAnonymousName() : null)")
    @Mapping(target = "senderAvatar", expression = "java(notification.getSender() != null ? notification.getSender().getAnonymousAvatar() : null)")
    @Mapping(target = "senderId", expression = "java(notification.getSender() != null ? notification.getSender().getId() : null)")
    @Mapping(target = "type", expression = "java(notification.getNotificationType() != null ? notification.getNotificationType().name().toLowerCase() : null)")
    @Mapping(target = "actor", expression = "java(notification.getSender() != null ? notification.getSender().getAnonymousName() : null)")
    @Mapping(target = "actorEmoji", expression = "java(getActorEmoji(notification))")
    NotificationDto toDto(Notification notification);

    List<NotificationDto> toDtoList(List<Notification> notifications);

    default String getActorEmoji(Notification notification) {
        if (notification.getSender() == null) return "\uD83E\uDD8A";
        return UserMapper.ANIMAL_EMOJIS.getOrDefault(
            notification.getSender().getAnonymousName().split("-")[0], "\uD83E\uDD8A");
    }
}
