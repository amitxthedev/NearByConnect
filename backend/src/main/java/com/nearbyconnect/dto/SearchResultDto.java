package com.nearbyconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDto {
    private List<UserDto> users;
    private List<UserDto> people;
    private List<CommunityDto> communities;
    private List<PostDto> posts;
    private List<CityDto> cities;
    private List<String> hashtags;
}
