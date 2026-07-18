package com.nearbyconnect.service;

import com.nearbyconnect.dto.CommunityDto;
import com.nearbyconnect.dto.CreateCommunityRequest;
import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.dto.UserDto;
import java.util.List;

public interface CommunityService {
    CommunityDto getCommunityById(Long id);
    PageResponse<CommunityDto> getCommunitiesByCity(Long cityId, int page, int size);
    List<CommunityDto> getSuggestedCommunities(Long cityId, int limit);
    List<CommunityDto> getTrendingCommunities(Long cityId, int limit);
    CommunityDto createCommunity(CreateCommunityRequest request);
    CommunityDto updateCommunity(Long id, CreateCommunityRequest request);
    void deleteCommunity(Long id);
    CommunityDto joinCommunity(Long communityId);
    CommunityDto leaveCommunity(Long communityId);
    boolean isMember(Long communityId, Long userId);
    PageResponse<UserDto> getCommunityMembers(Long communityId, int page, int size);
}
