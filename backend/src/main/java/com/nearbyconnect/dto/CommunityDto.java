package com.nearbyconnect.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityDto {
    private Long id;
    private String name;
    private String description;
    private CityDto city;
    private InterestDto interest;
    private String coverImage;
    private int memberCount;
    private int postCount;
    @JsonProperty("isPublic")
    private boolean isPublic;
    private String createdBy;
    @JsonProperty("isMember")
    private boolean isMember;
    private LocalDateTime createdAt;
}
