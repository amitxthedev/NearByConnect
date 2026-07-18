package com.nearbyconnect.service;

import com.nearbyconnect.dto.CommentDto;
import com.nearbyconnect.dto.CreateCommentRequest;
import com.nearbyconnect.dto.PageResponse;
import java.util.List;

public interface CommentService {
    PageResponse<CommentDto> getCommentsByPost(Long postId, int page, int size);
    List<CommentDto> getReplies(Long commentId);
    CommentDto createComment(Long postId, CreateCommentRequest request);
    CommentDto updateComment(Long commentId, CreateCommentRequest request);
    void deleteComment(Long commentId);
    CommentDto likeComment(Long commentId);
    CommentDto unlikeComment(Long commentId);
}
