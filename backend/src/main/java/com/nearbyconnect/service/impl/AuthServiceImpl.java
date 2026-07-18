package com.nearbyconnect.service.impl;

import com.nearbyconnect.dto.AuthResponse;
import com.nearbyconnect.dto.LoginRequest;
import com.nearbyconnect.dto.RegisterRequest;
import com.nearbyconnect.dto.UserDto;
import com.nearbyconnect.entity.City;
import com.nearbyconnect.entity.Interest;
import com.nearbyconnect.entity.User;
import com.nearbyconnect.enums.AccountStatus;
import com.nearbyconnect.enums.Role;
import com.nearbyconnect.mapper.UserMapper;
import com.nearbyconnect.repository.CityRepository;
import com.nearbyconnect.repository.InterestRepository;
import com.nearbyconnect.repository.UserRepository;
import com.nearbyconnect.security.JwtTokenProvider;
import com.nearbyconnect.service.AuthService;
import com.nearbyconnect.util.AnonymousNameGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CityRepository cityRepository;
    private final InterestRepository interestRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AnonymousNameGenerator nameGenerator;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        User user = User.builder()
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .anonymousName(request.getUsername())
                .anonymousAvatar(nameGenerator.generateAvatarSeed())
                .role(Role.USER)
                .accountStatus(AccountStatus.ACTIVE)
                .reputation(0)
                .interests(new ArrayList<>())
                .build();

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
        log.info("New user registered: {} (id={})", user.getAnonymousName(), user.getId());

        String accessToken = jwtTokenProvider.generateToken(user.getId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userMapper.toDto(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtTokenProvider.generateToken(user.getId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        log.info("User logged in: {} (id={})", user.getAnonymousName(), user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userMapper.toDto(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        Long userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtTokenProvider.generateToken(user.getId());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .user(userMapper.toDto(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toDto(user);
    }
}
