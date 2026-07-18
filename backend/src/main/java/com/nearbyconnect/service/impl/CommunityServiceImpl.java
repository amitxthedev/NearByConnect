package com.nearbyconnect.service.impl;

import com.nearbyconnect.dto.CommunityDto;
import com.nearbyconnect.dto.CreateCommunityRequest;
import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.dto.UserDto;
import com.nearbyconnect.entity.City;
import com.nearbyconnect.entity.Community;
import com.nearbyconnect.entity.CommunityMember;
import com.nearbyconnect.entity.Interest;
import com.nearbyconnect.entity.User;
import com.nearbyconnect.mapper.CommunityMapper;
import com.nearbyconnect.mapper.UserMapper;
import com.nearbyconnect.repository.CityRepository;
import com.nearbyconnect.repository.CommunityMemberRepository;
import com.nearbyconnect.repository.CommunityRepository;
import com.nearbyconnect.repository.InterestRepository;
import com.nearbyconnect.repository.UserRepository;
import com.nearbyconnect.security.SecurityUtils;
import com.nearbyconnect.service.CommunityService;
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
public class CommunityServiceImpl implements CommunityService {

    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final UserRepository userRepository;
    private final InterestRepository interestRepository;
    private final CityRepository cityRepository;
    private final CommunityMapper communityMapper;
    private final UserMapper userMapper;

    @Override
    public CommunityDto getCommunityById(Long id) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Community not found with id: " + id));
        CommunityDto dto = communityMapper.toDto(community);
        Long currentUserId = getCurrentUserId();
        dto.setMember(communityMemberRepository.existsByCommunityIdAndUserId(id, currentUserId));
        return dto;
    }

    @Override
    public PageResponse<CommunityDto> getCommunitiesByCity(Long cityId, int page, int size) {
        Long currentUserId = getCurrentUserIdOrNull();
        Pageable pageable = PageRequest.of(page, size);
        Page<Community> communities = communityRepository.findByCityId(cityId, pageable);
        PageResponse<CommunityDto> response = buildPageResponse(communities);
        if (currentUserId != null) {
            response.getContent().forEach(dto ->
                dto.setMember(communityMemberRepository.existsByCommunityIdAndUserId(dto.getId(), currentUserId))
            );
        }
        return response;
    }

    @Override
    public List<CommunityDto> getSuggestedCommunities(Long cityId, int limit) {
        Long currentUserId = getCurrentUserIdOrNull();
        Pageable pageable = PageRequest.of(0, limit);
        List<Community> communities = communityRepository.findTrendingByCity(cityId, pageable);
        List<CommunityDto> dtos = communityMapper.toDtoList(communities);
        if (currentUserId != null) {
            dtos.forEach(dto ->
                dto.setMember(communityMemberRepository.existsByCommunityIdAndUserId(dto.getId(), currentUserId))
            );
        }
        return dtos;
    }

    @Override
    public List<CommunityDto> getTrendingCommunities(Long cityId, int limit) {
        Long currentUserId = getCurrentUserIdOrNull();
        Pageable pageable = PageRequest.of(0, limit);
        List<Community> communities = communityRepository.findTrendingByCity(cityId, pageable);
        List<CommunityDto> dtos = communityMapper.toDtoList(communities);
        if (currentUserId != null) {
            dtos.forEach(dto ->
                dto.setMember(communityMemberRepository.existsByCommunityIdAndUserId(dto.getId(), currentUserId))
            );
        }
        return dtos;
    }

    @Override
    @Transactional
    public CommunityDto joinCommunity(Long communityId) {
        Long userId = getCurrentUserId();
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found"));

        if (communityMemberRepository.existsByCommunityIdAndUserId(communityId, userId)) {
            throw new RuntimeException("Already a member of this community");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CommunityMember member = CommunityMember.builder()
                .community(community)
                .user(user)
                .role("MEMBER")
                .build();
        communityMemberRepository.save(member);
        community.setMemberCount(community.getMemberCount() + 1);
        communityRepository.save(community);

        return getCommunityById(communityId);
    }

    @Override
    @Transactional
    public CommunityDto leaveCommunity(Long communityId) {
        Long userId = getCurrentUserId();
        CommunityMember member = communityMemberRepository.findByCommunityIdAndUserId(communityId, userId)
                .orElseThrow(() -> new RuntimeException("Not a member of this community"));

        communityMemberRepository.delete(member);
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found"));
        community.setMemberCount(Math.max(0, community.getMemberCount() - 1));
        communityRepository.save(community);

        return getCommunityById(communityId);
    }

    @Override
    @Transactional
    public CommunityDto createCommunity(CreateCommunityRequest request) {
        Long userId = getCurrentUserId();
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Community community = Community.builder()
                .name(request.getName())
                .description(request.getDescription())
                .city(creator.getCity())
                .memberCount(0)
                .isPublic(true)
                .createdBy(creator)
                .build();

        if (request.getInterestId() != null) {
            Interest interest = interestRepository.findById(request.getInterestId())
                    .orElseThrow(() -> new RuntimeException("Interest not found"));
            community.setInterest(interest);
        }

        community = communityRepository.save(community);
        log.info("Community '{}' created by user {}", community.getName(), userId);

        joinCommunity(community.getId());
        return getCommunityById(community.getId());
    }

    @Override
    @Transactional
    public CommunityDto updateCommunity(Long id, CreateCommunityRequest request) {
        Long userId = getCurrentUserId();
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Community not found"));

        if (community.getCreatedBy() == null || !community.getCreatedBy().getId().equals(userId)) {
            throw new RuntimeException("Only the creator can update this community");
        }

        if (request.getName() != null) community.setName(request.getName());
        if (request.getDescription() != null) community.setDescription(request.getDescription());
        if (request.getCoverImage() != null) community.setCoverImage(request.getCoverImage());
        if (request.getInterestId() != null) {
            Interest interest = interestRepository.findById(request.getInterestId())
                    .orElseThrow(() -> new RuntimeException("Interest not found"));
            community.setInterest(interest);
        }

        community = communityRepository.save(community);
        return getCommunityById(community.getId());
    }

    @Override
    @Transactional
    public void deleteCommunity(Long id) {
        Long userId = getCurrentUserId();
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Community not found"));

        if (community.getCreatedBy() == null || !community.getCreatedBy().getId().equals(userId)) {
            throw new RuntimeException("Only the creator can delete this community");
        }

        communityRepository.delete(community);
        log.info("Community '{}' deleted by user {}", community.getName(), userId);
    }

    @Override
    public PageResponse<UserDto> getCommunityMembers(Long communityId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CommunityMember> members = communityMemberRepository.findByCommunityIdOrderByJoinedAtDesc(communityId, pageable);
        List<UserDto> users = members.getContent().stream()
                .map(m -> userMapper.toDto(m.getUser()))
                .toList();
        return PageResponse.<UserDto>builder()
                .content(users)
                .page(members.getNumber())
                .size(members.getSize())
                .totalElements(members.getTotalElements())
                .totalPages(members.getTotalPages())
                .isFirst(members.isFirst())
                .isLast(members.isLast())
                .build();
    }

    @Override
    public boolean isMember(Long communityId, Long userId) {
        return communityMemberRepository.existsByCommunityIdAndUserId(communityId, userId);
    }

    private Long getCurrentUserId() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("User not authenticated");
        }
        return userId;
    }

    private Long getCurrentUserIdOrNull() {
        return SecurityUtils.getCurrentUserId();
    }

    private PageResponse<CommunityDto> buildPageResponse(Page<Community> page) {
        return PageResponse.<CommunityDto>builder()
                .content(communityMapper.toDtoList(page.getContent()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .isFirst(page.isFirst())
                .isLast(page.isLast())
                .build();
    }
}
