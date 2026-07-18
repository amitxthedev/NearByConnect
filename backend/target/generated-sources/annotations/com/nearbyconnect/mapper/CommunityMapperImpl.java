package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.CommunityDto;
import com.nearbyconnect.entity.Community;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-18T03:35:37+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class CommunityMapperImpl implements CommunityMapper {

    @Autowired
    private CityMapper cityMapper;
    @Autowired
    private InterestMapper interestMapper;

    @Override
    public CommunityDto toDto(Community community) {
        if ( community == null ) {
            return null;
        }

        CommunityDto.CommunityDtoBuilder communityDto = CommunityDto.builder();

        communityDto.city( cityMapper.toDto( community.getCity() ) );
        communityDto.coverImage( community.getCoverImage() );
        communityDto.createdAt( community.getCreatedAt() );
        communityDto.description( community.getDescription() );
        communityDto.id( community.getId() );
        communityDto.interest( interestMapper.toDto( community.getInterest() ) );
        communityDto.memberCount( community.getMemberCount() );
        communityDto.name( community.getName() );

        communityDto.createdBy( community.getCreatedBy() != null ? community.getCreatedBy().getAnonymousName() : null );
        communityDto.postCount( community.getPosts() != null ? community.getPosts().size() : 0 );
        communityDto.isMember( false );

        return communityDto.build();
    }

    @Override
    public List<CommunityDto> toDtoList(List<Community> communities) {
        if ( communities == null ) {
            return null;
        }

        List<CommunityDto> list = new ArrayList<CommunityDto>( communities.size() );
        for ( Community community : communities ) {
            list.add( toDto( community ) );
        }

        return list;
    }
}
