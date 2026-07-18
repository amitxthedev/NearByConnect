package com.nearbyconnect.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String anonymousName;

    @Size(max = 500, message = "Bio must be less than 500 characters")
    private String bio;

    private String avatarEmoji;

    private Long cityId;

    private List<Long> interestIds;
}
