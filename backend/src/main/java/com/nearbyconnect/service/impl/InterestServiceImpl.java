package com.nearbyconnect.service.impl;

import com.nearbyconnect.dto.InterestDto;
import com.nearbyconnect.entity.Interest;
import com.nearbyconnect.mapper.InterestMapper;
import com.nearbyconnect.repository.InterestRepository;
import com.nearbyconnect.service.InterestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class InterestServiceImpl implements InterestService {

    private final InterestRepository interestRepository;
    private final InterestMapper interestMapper;

    @Override
    public List<InterestDto> getAllInterests() {
        List<Interest> interests = interestRepository.findAll();
        return interestMapper.toDtoList(interests);
    }

    @Override
    public InterestDto getInterestById(Long id) {
        Interest interest = interestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interest not found with id: " + id));
        return interestMapper.toDto(interest);
    }

    @Override
    public List<InterestDto> searchInterests(String query) {
        List<Interest> interests = interestRepository.findByNameContainingIgnoreCase(query);
        return interestMapper.toDtoList(interests);
    }
}
