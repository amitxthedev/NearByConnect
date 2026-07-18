package com.nearbyconnect.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nearbyconnect.enums.PostType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    private Long id;
    private String title;
    private String content;
    private PostType postType;
    private String authorName;
    private String authorAvatar;
    private Long authorId;
    private Long communityId;
    private String communityName;
    private int likeCount;
    private int commentCount;
    private int viewCount;
    @JsonProperty("isPinned")
    private boolean isPinned;
    @JsonProperty("isEdited")
    private boolean isEdited;
    @JsonProperty("isLiked")
    private boolean isLiked;
    @JsonProperty("isBookmarked")
    private boolean isBookmarked;
    private String hashtags;
    private String mediaUrl;
    private List<CommentDto> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
