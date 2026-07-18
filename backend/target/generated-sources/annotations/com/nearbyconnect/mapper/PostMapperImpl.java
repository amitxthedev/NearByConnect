package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.PostDto;
import com.nearbyconnect.entity.Post;
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
public class PostMapperImpl implements PostMapper {

    @Override
    public PostDto toDto(Post post) {
        if ( post == null ) {
            return null;
        }

        PostDto.PostDtoBuilder postDto = PostDto.builder();

        postDto.commentCount( post.getCommentCount() );
        postDto.content( post.getContent() );
        postDto.createdAt( post.getCreatedAt() );
        postDto.hashtags( post.getHashtags() );
        postDto.id( post.getId() );
        postDto.likeCount( post.getLikeCount() );
        postDto.postType( post.getPostType() );
        postDto.title( post.getTitle() );
        postDto.updatedAt( post.getUpdatedAt() );
        postDto.viewCount( post.getViewCount() );

        postDto.authorName( post.getAuthor() != null ? post.getAuthor().getAnonymousName() : null );
        postDto.authorAvatar( getAuthorEmoji(post) );
        postDto.authorId( post.getAuthor() != null ? post.getAuthor().getId() : null );
        postDto.communityId( post.getCommunity() != null ? post.getCommunity().getId() : null );
        postDto.communityName( post.getCommunity() != null ? post.getCommunity().getName() : null );
        postDto.mediaUrl( getMediaUrl(post) );

        return postDto.build();
    }

    @Override
    public List<PostDto> toDtoList(List<Post> posts) {
        if ( posts == null ) {
            return null;
        }

        List<PostDto> list = new ArrayList<PostDto>( posts.size() );
        for ( Post post : posts ) {
            list.add( toDto( post ) );
        }

        return list;
    }
}
