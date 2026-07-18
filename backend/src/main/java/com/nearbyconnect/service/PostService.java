package com.nearbyconnect.service;

import com.nearbyconnect.dto.CreatePostRequest;
import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.dto.PostDto;

public interface PostService {
    PostDto getPostById(Long id);
    PostDto createPost(CreatePostRequest request);
    PostDto updatePost(Long id, CreatePostRequest request);
    void deletePost(Long id);
    PageResponse<PostDto> getFeed(Long cityId, int page, int size);
    PageResponse<PostDto> getCommunityPosts(Long communityId, int page, int size);
    PageResponse<PostDto> getUserPosts(Long userId, int page, int size);
    PageResponse<PostDto> getTrendingPosts(Long cityId, int page, int size);
    PostDto likePost(Long postId);
    PostDto unlikePost(Long postId);
    PostDto bookmarkPost(Long postId);
    PostDto unbookmarkPost(Long postId);
    PageResponse<PostDto> getBookmarks(int page, int size);
    PageResponse<PostDto> searchPosts(String query, int page, int size);
}
