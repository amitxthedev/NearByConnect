package com.nearbyconnect.service.impl;

import com.nearbyconnect.dto.CommentDto;
import com.nearbyconnect.dto.CreateCommentRequest;
import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.entity.Comment;
import com.nearbyconnect.entity.Post;
import com.nearbyconnect.entity.User;
import com.nearbyconnect.mapper.CommentMapper;
import com.nearbyconnect.repository.CommentRepository;
import com.nearbyconnect.repository.LikeRepository;
import com.nearbyconnect.repository.PostRepository;
import com.nearbyconnect.repository.UserRepository;
import com.nearbyconnect.security.SecurityUtils;
import com.nearbyconnect.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final CommentMapper commentMapper;

    @Override
    public PageResponse<CommentDto> getCommentsByPost(Long postId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> comments = commentRepository.findByPostIdAndParentCommentIsNullOrderByCreatedAtDesc(postId, pageable);
        return PageResponse.<CommentDto>builder()
                .content(commentMapper.toDtoList(comments.getContent()))
                .page(comments.getNumber())
                .size(comments.getSize())
                .totalElements(comments.getTotalElements())
                .totalPages(comments.getTotalPages())
                .isFirst(comments.isFirst())
                .isLast(comments.isLast())
                .build();
    }

    @Override
    public List<CommentDto> getReplies(Long commentId) {
        List<Comment> replies = commentRepository.findByParentCommentIdOrderByCreatedAtAsc(commentId);
        return commentMapper.toDtoList(replies);
    }

    @Override
    @Transactional
    public CommentDto createComment(Long postId, CreateCommentRequest request) {
        Long userId = getCurrentUserId();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .author(author)
                .post(post)
                .build();

        if (request.getParentCommentId() != null) {
            Comment parent = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParentComment(parent);
        }

        comment = commentRepository.save(comment);
        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);
        return commentMapper.toDto(comment);
    }

    @Override
    @Transactional
    public CommentDto updateComment(Long commentId, CreateCommentRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthor().getId().equals(getCurrentUserId())) {
            throw new RuntimeException("Not authorized");
        }
        comment.setContent(request.getContent());
        comment.setEdited(true);
        comment = commentRepository.save(comment);
        return commentMapper.toDto(comment);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthor().getId().equals(getCurrentUserId())) {
            throw new RuntimeException("Not authorized");
        }

        Post post = comment.getPost();
        post.setCommentCount(Math.max(0, post.getCommentCount() - 1));
        postRepository.save(post);
        commentRepository.delete(comment);
    }

    @Override
    @Transactional
    public CommentDto likeComment(Long commentId) {
        commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        Comment comment = commentRepository.findById(commentId).get();
        comment.setLikeCount(comment.getLikeCount() + 1);
        comment = commentRepository.save(comment);
        return commentMapper.toDto(comment);
    }

    @Override
    @Transactional
    public CommentDto unlikeComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setLikeCount(Math.max(0, comment.getLikeCount() - 1));
        comment = commentRepository.save(comment);
        return commentMapper.toDto(comment);
    }

    private Long getCurrentUserId() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("User not authenticated");
        }
        return userId;
    }
}
