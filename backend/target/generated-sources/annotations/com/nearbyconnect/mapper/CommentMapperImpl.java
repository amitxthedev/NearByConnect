package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.CommentDto;
import com.nearbyconnect.entity.Comment;
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
public class CommentMapperImpl implements CommentMapper {

    @Override
    public CommentDto toDto(Comment comment) {
        if ( comment == null ) {
            return null;
        }

        CommentDto.CommentDtoBuilder commentDto = CommentDto.builder();

        commentDto.content( comment.getContent() );
        commentDto.createdAt( comment.getCreatedAt() );
        commentDto.id( comment.getId() );
        commentDto.likeCount( comment.getLikeCount() );

        commentDto.authorName( comment.getAuthor() != null ? comment.getAuthor().getAnonymousName() : null );
        commentDto.authorAvatar( getAuthorEmoji(comment) );
        commentDto.authorId( comment.getAuthor() != null ? comment.getAuthor().getId() : null );
        commentDto.postId( comment.getPost() != null ? comment.getPost().getId() : null );
        commentDto.parentCommentId( comment.getParentComment() != null ? comment.getParentComment().getId() : null );

        return commentDto.build();
    }

    @Override
    public List<CommentDto> toDtoList(List<Comment> comments) {
        if ( comments == null ) {
            return null;
        }

        List<CommentDto> list = new ArrayList<CommentDto>( comments.size() );
        for ( Comment comment : comments ) {
            list.add( toDto( comment ) );
        }

        return list;
    }
}
