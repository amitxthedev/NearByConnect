package com.nearbyconnect.service.impl;

import com.nearbyconnect.dto.CommunityDto;
import com.nearbyconnect.dto.DashboardDto;
import com.nearbyconnect.dto.PostDto;
import com.nearbyconnect.entity.Community;
import com.nearbyconnect.entity.Post;
import com.nearbyconnect.mapper.CommunityMapper;
import com.nearbyconnect.mapper.PostMapper;
import com.nearbyconnect.repository.CommunityMemberRepository;
import com.nearbyconnect.repository.CommunityRepository;
import com.nearbyconnect.repository.PostRepository;
import com.nearbyconnect.repository.UserRepository;
import com.nearbyconnect.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final CommunityMemberRepository communityMemberRepository;
    private final CommunityRepository communityRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommunityMapper communityMapper;
    private final PostMapper postMapper;

    @Override
    public DashboardDto getDashboard(Long cityId) {
        List<Community> trendingCommunities = communityRepository
                .findByCityIdOrderByMemberCountDesc(cityId, PageRequest.of(0, 6))
                .getContent();

        List<Post> trendingPosts = postRepository
                .findByCommunityCityIdOrderByLikeCountDesc(cityId, PageRequest.of(0, 5))
                .getContent();

        List<Post> recentPosts = postRepository
                .findByCommunityCityIdOrderByCreatedAtDesc(cityId, PageRequest.of(0, 5))
                .getContent();

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        long newPostsToday = postRepository.countByCreatedAtAfter(startOfDay);

        return DashboardDto.builder()
                .trendingCommunities(trendingCommunities.stream().map(communityMapper::toDto).collect(Collectors.toList()))
                .trendingPosts(trendingPosts.stream().map(postMapper::toDto).collect(Collectors.toList()))
                .recentPosts(recentPosts.stream().map(postMapper::toDto).collect(Collectors.toList()))
                .totalCommunities(communityRepository.countByCityId(cityId))
                .totalPosts(postRepository.count())
                .totalUsers(userRepository.count())
                .onlineUsers(communityMemberRepository.count())
                .trendingPostsCount(postRepository.countByCommunityCityId(cityId))
                .onlineUsersCount(communityMemberRepository.count())
                .newPostsToday(newPostsToday)
                .build();
    }
}
