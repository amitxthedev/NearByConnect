package com.nearbyconnect.service;

import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.dto.UpdateProfileRequest;
import com.nearbyconnect.dto.UserDto;
import com.nearbyconnect.dto.AnonymousIdentityRequest;
import java.util.List;

public interface UserService {
    UserDto getProfile(Long userId);
    UserDto getCurrentUser();
    UserDto createAnonymousIdentity(AnonymousIdentityRequest request);
    UserDto regenerateAnonymousName();
    UserDto updateInterests(List<Long> interestIds);
    UserDto updateCity(Long cityId);
    UserDto updateProfile(UpdateProfileRequest request);
    PageResponse<UserDto> searchUsers(String query, int page, int size);
}
