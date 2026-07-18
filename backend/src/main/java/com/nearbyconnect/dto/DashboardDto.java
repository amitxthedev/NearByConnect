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
public class DashboardDto {
    private List<PostDto> trendingPosts;
    private List<CommunityDto> trendingCommunities;
    private List<CommunityDto> suggestedCommunities;
    private List<PostDto> recentPosts;
    private List<ChatRoomDto> activeRooms;
    private long totalCommunities;
    private long totalPosts;
    private long totalUsers;
    private long onlineUsers;
    private long trendingPostsCount;
    private long onlineUsersCount;
    private long newPostsToday;
}
