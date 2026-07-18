package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.CommunityDto;
import com.nearbyconnect.entity.Community;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring", uses = {CityMapper.class, InterestMapper.class})
public interface CommunityMapper {
    @Mapping(target = "createdBy", expression = "java(community.getCreatedBy() != null ? community.getCreatedBy().getAnonymousName() : null)")
    @Mapping(target = "postCount", expression = "java(community.getPosts() != null ? community.getPosts().size() : 0)")
    @Mapping(target = "isMember", expression = "java(false)")
    CommunityDto toDto(Community community);

    List<CommunityDto> toDtoList(List<Community> communities);
}
