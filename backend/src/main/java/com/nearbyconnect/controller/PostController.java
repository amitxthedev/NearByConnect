package com.nearbyconnect.controller;

import com.nearbyconnect.dto.CreatePostRequest;
import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.dto.PostDto;
import com.nearbyconnect.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(@Valid @RequestBody CreatePostRequest request) {
        return ResponseEntity.ok(postService.createPost(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDto> updatePost(@PathVariable Long id, @Valid @RequestBody CreatePostRequest request) {
        return ResponseEntity.ok(postService.updatePost(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/feed")
    public ResponseEntity<PageResponse<PostDto>> getFeed(
            @RequestParam Long cityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(postService.getFeed(cityId, page, size));
    }

    @GetMapping("/community/{communityId}")
    public ResponseEntity<PageResponse<PostDto>> getCommunityPosts(
            @PathVariable Long communityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(postService.getCommunityPosts(communityId, page, size));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<PageResponse<PostDto>> getUserPosts(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(postService.getUserPosts(userId, page, size));
    }

    @GetMapping("/trending")
    public ResponseEntity<PageResponse<PostDto>> getTrendingPosts(
            @RequestParam Long cityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(postService.getTrendingPosts(cityId, page, size));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<PostDto> likePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.likePost(id));
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<PostDto> unlikePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.unlikePost(id));
    }

    @PostMapping("/{id}/bookmark")
    public ResponseEntity<PostDto> bookmarkPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.bookmarkPost(id));
    }

    @DeleteMapping("/{id}/bookmark")
    public ResponseEntity<PostDto> unbookmarkPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.unbookmarkPost(id));
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<PageResponse<PostDto>> getBookmarks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(postService.getBookmarks(page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<PostDto>> searchPosts(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(postService.searchPosts(q, page, size));
    }
}
