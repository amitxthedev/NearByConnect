package com.nearbyconnect.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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
public class CommentDto {
    private Long id;
    private String content;
    private String authorName;
    private String authorAvatar;
    private Long authorId;
    private Long postId;
    private Long parentCommentId;
    private int likeCount;
    @JsonProperty("isEdited")
    private boolean isEdited;
    @JsonProperty("isLiked")
    private boolean isLiked;
    private List<CommentDto> replies;
    private LocalDateTime createdAt;
}
