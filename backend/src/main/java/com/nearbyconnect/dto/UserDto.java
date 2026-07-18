package com.nearbyconnect.dto;

import com.nearbyconnect.enums.AccountStatus;
import com.nearbyconnect.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String anonymousName;
    private String anonymousAvatar;
    private String avatarEmoji;
    private CityDto city;
    private List<InterestDto> interests;
    private Role role;
    private AccountStatus accountStatus;
    private int reputation;
    private int postCount;
    private int communityCount;
    private String bio;
    private LocalDateTime lastActiveAt;
    private LocalDateTime createdAt;
}
