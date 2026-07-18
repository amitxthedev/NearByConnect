package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.CommentDto;
import com.nearbyconnect.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    @Mapping(target = "authorName", expression = "java(comment.getAuthor() != null ? comment.getAuthor().getAnonymousName() : null)")
    @Mapping(target = "authorAvatar", expression = "java(getAuthorEmoji(comment))")
    @Mapping(target = "authorId", expression = "java(comment.getAuthor() != null ? comment.getAuthor().getId() : null)")
    @Mapping(target = "postId", expression = "java(comment.getPost() != null ? comment.getPost().getId() : null)")
    @Mapping(target = "parentCommentId", expression = "java(comment.getParentComment() != null ? comment.getParentComment().getId() : null)")
    @Mapping(target = "replies", ignore = true)
    @Mapping(target = "isLiked", ignore = true)
    CommentDto toDto(Comment comment);

    List<CommentDto> toDtoList(List<Comment> comments);

    default String getAuthorEmoji(Comment comment) {
        if (comment.getAuthor() == null || comment.getAuthor().getAnonymousName() == null) return "\uD83E\uDD8A";
        String animal = comment.getAuthor().getAnonymousName().split("-")[0];
        return UserMapper.ANIMAL_EMOJIS.getOrDefault(animal, "\uD83E\uDD8A");
    }
}
