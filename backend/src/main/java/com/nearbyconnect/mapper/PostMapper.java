package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.PostDto;
import com.nearbyconnect.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring", uses = {CommentMapper.class})
public interface PostMapper {
    @Mapping(target = "authorName", expression = "java(post.getAuthor() != null ? post.getAuthor().getAnonymousName() : null)")
    @Mapping(target = "authorAvatar", expression = "java(getAuthorEmoji(post))")
    @Mapping(target = "authorId", expression = "java(post.getAuthor() != null ? post.getAuthor().getId() : null)")
    @Mapping(target = "communityId", expression = "java(post.getCommunity() != null ? post.getCommunity().getId() : null)")
    @Mapping(target = "communityName", expression = "java(post.getCommunity() != null ? post.getCommunity().getName() : null)")
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "isLiked", ignore = true)
    @Mapping(target = "isBookmarked", ignore = true)
    @Mapping(target = "mediaUrl", expression = "java(getMediaUrl(post))")
    PostDto toDto(Post post);

    List<PostDto> toDtoList(List<Post> posts);

    default String getAuthorEmoji(Post post) {
        if (post.getAuthor() == null || post.getAuthor().getAnonymousName() == null) return "\uD83E\uDD8A";
        String animal = post.getAuthor().getAnonymousName().split("-")[0];
        return UserMapper.ANIMAL_EMOJIS.getOrDefault(animal, "\uD83E\uDD8A");
    }

    default String getMediaUrl(Post post) {
        if (post.getMedia() == null || post.getMedia().isEmpty()) return null;
        return post.getMedia().get(0).getUrl();
    }
}
