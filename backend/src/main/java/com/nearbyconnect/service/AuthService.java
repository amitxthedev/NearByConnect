package com.nearbyconnect.service;

import com.nearbyconnect.dto.AuthResponse;
import com.nearbyconnect.dto.LoginRequest;
import com.nearbyconnect.dto.RegisterRequest;
import com.nearbyconnect.dto.UserDto;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String refreshToken);
    UserDto getCurrentUser(Long userId);
}
