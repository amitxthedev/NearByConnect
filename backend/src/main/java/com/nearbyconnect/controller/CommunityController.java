package com.nearbyconnect.controller;

import com.nearbyconnect.dto.CommunityDto;
import com.nearbyconnect.dto.CreateCommunityRequest;
import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.dto.UserDto;
import com.nearbyconnect.service.CommunityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/v1/communities")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @GetMapping("/{id}")
    public ResponseEntity<CommunityDto> getCommunityById(@PathVariable Long id) {
        return ResponseEntity.ok(communityService.getCommunityById(id));
    }

    @GetMapping("/city/{cityId}")
    public ResponseEntity<PageResponse<CommunityDto>> getCommunitiesByCity(
            @PathVariable Long cityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(communityService.getCommunitiesByCity(cityId, page, size));
    }

    @GetMapping("/city/{cityId}/suggested")
    public ResponseEntity<List<CommunityDto>> getSuggested(
            @PathVariable Long cityId,
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(communityService.getSuggestedCommunities(cityId, limit));
    }

    @GetMapping("/city/{cityId}/trending")
    public ResponseEntity<List<CommunityDto>> getTrending(
            @PathVariable Long cityId,
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(communityService.getTrendingCommunities(cityId, limit));
    }

    @PostMapping
    public ResponseEntity<CommunityDto> createCommunity(@Valid @RequestBody CreateCommunityRequest request) {
        return ResponseEntity.ok(communityService.createCommunity(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommunityDto> updateCommunity(
            @PathVariable Long id,
            @Valid @RequestBody CreateCommunityRequest request) {
        return ResponseEntity.ok(communityService.updateCommunity(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommunity(@PathVariable Long id) {
        communityService.deleteCommunity(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<PageResponse<UserDto>> getCommunityMembers(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(communityService.getCommunityMembers(id, page, size));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<CommunityDto> joinCommunity(@PathVariable Long id) {
        return ResponseEntity.ok(communityService.joinCommunity(id));
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<CommunityDto> leaveCommunity(@PathVariable Long id) {
        return ResponseEntity.ok(communityService.leaveCommunity(id));
    }
}
