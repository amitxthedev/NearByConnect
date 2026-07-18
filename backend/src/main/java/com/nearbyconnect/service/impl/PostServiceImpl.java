package com.nearbyconnect.service.impl;

import com.nearbyconnect.dto.CreatePostRequest;
import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.dto.PostDto;
import com.nearbyconnect.entity.Bookmark;
import com.nearbyconnect.entity.Community;
import com.nearbyconnect.entity.Like;
import com.nearbyconnect.entity.Post;
import com.nearbyconnect.entity.User;
import com.nearbyconnect.mapper.PostMapper;
import com.nearbyconnect.repository.BookmarkRepository;
import com.nearbyconnect.repository.CommunityMemberRepository;
import com.nearbyconnect.repository.CommunityRepository;
import com.nearbyconnect.repository.LikeRepository;
import com.nearbyconnect.repository.PostRepository;
import com.nearbyconnect.repository.UserRepository;
import com.nearbyconnect.security.SecurityUtils;
import com.nearbyconnect.service.PostService;
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
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final LikeRepository likeRepository;
    private final BookmarkRepository bookmarkRepository;
    private final PostMapper postMapper;

    @Override
    public PostDto getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        PostDto dto = postMapper.toDto(post);
        Long userId = getCurrentUserId();
        dto.setLiked(likeRepository.existsByUserIdAndPostId(userId, id));
        dto.setBookmarked(bookmarkRepository.existsByUserIdAndPostId(userId, id));
        return dto;
    }

    @Override
    @Transactional
    public PostDto createPost(CreatePostRequest request) {
        Long userId = getCurrentUserId();
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .postType(request.getPostType() != null ? request.getPostType() : com.nearbyconnect.enums.PostType.TEXT)
                .author(author)
                .hashtags(request.getHashtags())
                .build();

        if (request.getCommunityId() != null) {
            Community community = communityRepository.findById(request.getCommunityId())
                    .orElseThrow(() -> new RuntimeException("Community not found"));
            post.setCommunity(community);
        }

        post = postRepository.save(post);
        log.info("Post created: {} by user: {}", post.getId(), author.getAnonymousName());
        return postMapper.toDto(post);
    }

    @Override
    @Transactional
    public PostDto updatePost(Long id, CreatePostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getId().equals(getCurrentUserId())) {
            throw new RuntimeException("Not authorized to edit this post");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setHashtags(request.getHashtags());
        post.setEdited(true);
        post = postRepository.save(post);
        return postMapper.toDto(post);
    }

    @Override
    @Transactional
    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getId().equals(getCurrentUserId())) {
            throw new RuntimeException("Not authorized to delete this post");
        }
        postRepository.delete(post);
    }

    @Override
    public PageResponse<PostDto> getFeed(Long cityId, int page, int size) {
        List<Long> communityIds = communityMemberRepository.findCommunityIdsByUserId(getCurrentUserId());
        if (communityIds.isEmpty()) {
            Pageable pageable = PageRequest.of(page, size);
            Page<Post> posts = postRepository.findByCommunityIds(communityIds, pageable);
            return buildPageResponse(posts);
        }
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findByCommunityIds(communityIds, pageable);
        return buildPageResponse(posts);
    }

    @Override
    public PageResponse<PostDto> getCommunityPosts(Long communityId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findByCommunityIdOrderByCreatedAtDesc(communityId, pageable);
        return buildPageResponse(posts);
    }

    @Override
    public PageResponse<PostDto> getUserPosts(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findByAuthorIdOrderByCreatedAtDesc(userId, pageable);
        return buildPageResponse(posts);
    }

    @Override
    public PageResponse<PostDto> getTrendingPosts(Long cityId, int page, int size) {
        List<Long> communityIds = communityMemberRepository.findCommunityIdsByUserId(getCurrentUserId());
        Pageable pageable = PageRequest.of(page, size);
        List<Post> posts = postRepository.findTrendingByCommunityIds(communityIds, pageable);
        List<PostDto> dtos = postMapper.toDtoList(posts);
        return PageResponse.<PostDto>builder()
                .content(dtos)
                .page(page)
                .size(size)
                .totalElements(dtos.size())
                .totalPages(1)
                .isFirst(true)
                .isLast(true)
                .build();
    }

    @Override
    @Transactional
    public PostDto likePost(Long postId) {
        Long userId = getCurrentUserId();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (likeRepository.existsByUserIdAndPostId(userId, postId)) {
            throw new RuntimeException("Already liked this post");
        }

        Like like = Like.builder().user(userRepository.getReferenceById(userId)).post(post).build();
        likeRepository.save(like);
        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);
        return getPostById(postId);
    }

    @Override
    @Transactional
    public PostDto unlikePost(Long postId) {
        Long userId = getCurrentUserId();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        likeRepository.deleteByUserIdAndPostId(userId, postId);
        post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
        postRepository.save(post);
        return getPostById(postId);
    }

    @Override
    @Transactional
    public PostDto bookmarkPost(Long postId) {
        Long userId = getCurrentUserId();
        if (bookmarkRepository.existsByUserIdAndPostId(userId, postId)) {
            throw new RuntimeException("Already bookmarked");
        }

        Bookmark bookmark = Bookmark.builder()
                .user(userRepository.getReferenceById(userId))
                .post(postRepository.getReferenceById(postId))
                .build();
        bookmarkRepository.save(bookmark);
        return getPostById(postId);
    }

    @Override
    @Transactional
    public PostDto unbookmarkPost(Long postId) {
        bookmarkRepository.deleteByUserIdAndPostId(getCurrentUserId(), postId);
        return getPostById(postId);
    }

    @Override
    public PageResponse<PostDto> getBookmarks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Bookmark> bookmarks = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(getCurrentUserId(), pageable);
        List<PostDto> dtos = bookmarks.getContent().stream()
                .map(b -> postMapper.toDto(b.getPost()))
                .toList();
        return PageResponse.<PostDto>builder()
                .content(dtos)
                .page(bookmarks.getNumber())
                .size(bookmarks.getSize())
                .totalElements(bookmarks.getTotalElements())
                .totalPages(bookmarks.getTotalPages())
                .isFirst(bookmarks.isFirst())
                .isLast(bookmarks.isLast())
                .build();
    }

    @Override
    public PageResponse<PostDto> searchPosts(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.search(query, pageable);
        return buildPageResponse(posts);
    }

    private Long getCurrentUserId() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("User not authenticated");
        }
        return userId;
    }

    private PageResponse<PostDto> buildPageResponse(Page<Post> page) {
        return PageResponse.<PostDto>builder()
                .content(postMapper.toDtoList(page.getContent()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .isFirst(page.isFirst())
                .isLast(page.isLast())
                .build();
    }
}
