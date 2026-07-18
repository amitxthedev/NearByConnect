package com.nearbyconnect.service.impl;

import com.nearbyconnect.dto.SearchResultDto;
import com.nearbyconnect.mapper.CityMapper;
import com.nearbyconnect.mapper.CommunityMapper;
import com.nearbyconnect.mapper.PostMapper;
import com.nearbyconnect.mapper.UserMapper;
import com.nearbyconnect.repository.CityRepository;
import com.nearbyconnect.repository.CommunityRepository;
import com.nearbyconnect.repository.PostRepository;
import com.nearbyconnect.repository.UserRepository;
import com.nearbyconnect.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class SearchServiceImpl implements SearchService {

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final PostRepository postRepository;
    private final CityRepository cityRepository;
    private final UserMapper userMapper;
    private final CommunityMapper communityMapper;
    private final PostMapper postMapper;
    private final CityMapper cityMapper;

    @Override
    public SearchResultDto search(String query, Long cityId) {
        var pageable = PageRequest.of(0, 10);

        var people = userMapper.toDtoList(userRepository.searchByAnonymousName(query, pageable).getContent());

        return SearchResultDto.builder()
                .users(people)
                .people(people)
                .communities(communityMapper.toDtoList(communityRepository.search(query, pageable).getContent()))
                .posts(postMapper.toDtoList(postRepository.search(query, pageable).getContent()))
                .cities(cityMapper.toDtoList(cityRepository.findByNameContainingIgnoreCase(query)))
                .hashtags(java.util.List.of())
                .build();
    }
}
