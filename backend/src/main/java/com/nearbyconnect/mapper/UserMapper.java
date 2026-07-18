package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.UserDto;
import com.nearbyconnect.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;
import java.util.Map;
import java.util.AbstractMap;

@Mapper(componentModel = "spring", uses = {CityMapper.class, InterestMapper.class})
public interface UserMapper {

    Map<String, String> ANIMAL_EMOJIS = Map.ofEntries(
        new AbstractMap.SimpleEntry<>("Fox", "\uD83E\uDD8A"),
        new AbstractMap.SimpleEntry<>("Wolf", "\uD83D\uDC3A"),
        new AbstractMap.SimpleEntry<>("Lion", "\uD83E\uDD81"),
        new AbstractMap.SimpleEntry<>("Panda", "\uD83D\uDC3C"),
        new AbstractMap.SimpleEntry<>("Koala", "\uD83E\uDDA9"),
        new AbstractMap.SimpleEntry<>("Tiger", "\uD83D\uDC2F"),
        new AbstractMap.SimpleEntry<>("Eagle", "\uD83E\uDD85"),
        new AbstractMap.SimpleEntry<>("Octopus", "\uD83D\uDC19"),
        new AbstractMap.SimpleEntry<>("Butterfly", "\uD83E\uDD8B"),
        new AbstractMap.SimpleEntry<>("Shark", "\uD83E\uDD88"),
        new AbstractMap.SimpleEntry<>("Unicorn", "\uD83E\uDD84"),
        new AbstractMap.SimpleEntry<>("Dragon", "\uD83D\uDC32"),
        new AbstractMap.SimpleEntry<>("Stingray", "\uD83E\uDDBE"),
        new AbstractMap.SimpleEntry<>("Dolphin", "\uD83D\uDC2C"),
        new AbstractMap.SimpleEntry<>("Penguin", "\uD83D\uDC27"),
        new AbstractMap.SimpleEntry<>("Owl", "\uD83E\uDD89"),
        new AbstractMap.SimpleEntry<>("Bear", "\uD83D\uDC3B"),
        new AbstractMap.SimpleEntry<>("Hawk", "\uD83E\uDD85"),
        new AbstractMap.SimpleEntry<>("Falcon", "\uD83E\uDD85"),
        new AbstractMap.SimpleEntry<>("Rabbit", "\uD83D\uDC30"),
        new AbstractMap.SimpleEntry<>("Snake", "\uD83D\uDC0D"),
        new AbstractMap.SimpleEntry<>("Whale", "\uD83D\uDC0B"),
        new AbstractMap.SimpleEntry<>("Cat", "\uD83D\uDC31"),
        new AbstractMap.SimpleEntry<>("Crow", "\uD83E\uDD86")
    );

    @Mapping(target = "postCount", expression = "java(user.getPosts() != null ? user.getPosts().size() : 0)")
    @Mapping(target = "communityCount", expression = "java(user.getMemberships() != null ? user.getMemberships().size() : 0)")
    @Mapping(target = "avatarEmoji", expression = "java(getAvatarEmoji(user))")
    UserDto toDto(User user);

    List<UserDto> toDtoList(List<User> users);

    default String getAvatarEmoji(User user) {
        if (user.getAnonymousName() == null) return "\uD83E\uDD8A";
        String animal = user.getAnonymousName().split("-")[0];
        return ANIMAL_EMOJIS.getOrDefault(animal, "\uD83E\uDD8A");
    }
}
