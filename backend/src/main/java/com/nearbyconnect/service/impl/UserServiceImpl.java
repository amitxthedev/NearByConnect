package com.nearbyconnect.service.impl;

import com.nearbyconnect.dto.AnonymousIdentityRequest;
import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.dto.UpdateProfileRequest;
import com.nearbyconnect.dto.UserDto;
import com.nearbyconnect.entity.City;
import com.nearbyconnect.entity.Interest;
import com.nearbyconnect.entity.User;
import com.nearbyconnect.enums.AccountStatus;
import com.nearbyconnect.mapper.UserMapper;
import com.nearbyconnect.repository.CityRepository;
import com.nearbyconnect.repository.InterestRepository;
import com.nearbyconnect.repository.UserRepository;
import com.nearbyconnect.service.UserService;
import com.nearbyconnect.security.SecurityUtils;
import com.nearbyconnect.util.AnonymousNameGenerator;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CityRepository cityRepository;
    private final InterestRepository interestRepository;
    private final UserMapper userMapper;
    private final AnonymousNameGenerator nameGenerator;

    @Override
    public UserDto getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return userMapper.toDto(user);
    }

    @Override
    public UserDto getCurrentUser() {
        Long userId = getCurrentUserId();
        return getProfile(userId);
    }

    private Long getCurrentUserId() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("User not authenticated");
        }
        return userId;
    }

    @Override
    @Transactional
    public UserDto createAnonymousIdentity(AnonymousIdentityRequest request) {
        Long userId = getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAnonymousName(nameGenerator.generate());
        user.setAnonymousAvatar("/avatars/" + nameGenerator.generateAvatarSeed());

        if (request.getCityId() != null) {
            City city = cityRepository.findById(request.getCityId())
                    .orElseThrow(() -> new RuntimeException("City not found"));
            user.setCity(city);
        }

        if (request.getInterestIds() != null && !request.getInterestIds().isEmpty()) {
            List<Interest> interests = interestRepository.findAllById(request.getInterestIds());
        user.setInterests(new ArrayList<>(interests));
        }

        user = userRepository.save(user);
        return userMapper.toDto(user);
    }

    @Override
    @Transactional
    public UserDto regenerateAnonymousName() {
        Long userId = getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAnonymousName(nameGenerator.generate());
        user = userRepository.save(user);
        return userMapper.toDto(user);
    }

    @Override
    @Transactional
    public UserDto updateInterests(List<Long> interestIds) {
        Long userId = getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Interest> interests = interestRepository.findAllById(interestIds);
        user.setInterests(new ArrayList<>(interests));
        userRepository.save(user);
        User refreshed = userRepository.findById(userId).orElseThrow();
        return userMapper.toDto(refreshed);
    }

    @Override
    @Transactional
    public UserDto updateCity(Long cityId) {
        Long userId = getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new RuntimeException("City not found"));
        user.setCity(city);
        user = userRepository.save(user);
        return userMapper.toDto(user);
    }

    @Override
    @Transactional
    public UserDto updateProfile(UpdateProfileRequest request) {
        Long userId = getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getAnonymousName() != null) {
            user.setAnonymousName(request.getAnonymousName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getAvatarEmoji() != null) {
            user.setAnonymousAvatar(request.getAvatarEmoji());
        }
        if (request.getCityId() != null) {
            City city = cityRepository.findById(request.getCityId())
                    .orElseThrow(() -> new RuntimeException("City not found"));
            user.setCity(city);
        }
        if (request.getInterestIds() != null) {
            List<Interest> interests = interestRepository.findAllById(request.getInterestIds());
            user.setInterests(new ArrayList<>(interests));
        }

        user = userRepository.save(user);
        return userMapper.toDto(user);
    }

    @Override
    public PageResponse<UserDto> searchUsers(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.searchByAnonymousName(query, pageable);
        return PageResponse.<UserDto>builder()
                .content(userMapper.toDtoList(users.getContent()))
                .page(users.getNumber())
                .size(users.getSize())
                .totalElements(users.getTotalElements())
                .totalPages(users.getTotalPages())
                .isFirst(users.isFirst())
                .isLast(users.isLast())
                .build();
    }
}
