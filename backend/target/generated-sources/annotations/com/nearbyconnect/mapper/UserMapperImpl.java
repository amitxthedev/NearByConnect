package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.UserDto;
import com.nearbyconnect.entity.User;
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
public class UserMapperImpl implements UserMapper {

    @Autowired
    private CityMapper cityMapper;
    @Autowired
    private InterestMapper interestMapper;

    @Override
    public UserDto toDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDto.UserDtoBuilder userDto = UserDto.builder();

        userDto.accountStatus( user.getAccountStatus() );
        userDto.anonymousAvatar( user.getAnonymousAvatar() );
        userDto.anonymousName( user.getAnonymousName() );
        userDto.bio( user.getBio() );
        userDto.city( cityMapper.toDto( user.getCity() ) );
        userDto.createdAt( user.getCreatedAt() );
        userDto.id( user.getId() );
        userDto.interests( interestMapper.toDtoList( user.getInterests() ) );
        userDto.lastActiveAt( user.getLastActiveAt() );
        userDto.reputation( user.getReputation() );
        userDto.role( user.getRole() );
        userDto.username( user.getUsername() );

        userDto.postCount( user.getPosts() != null ? user.getPosts().size() : 0 );
        userDto.communityCount( user.getMemberships() != null ? user.getMemberships().size() : 0 );
        userDto.avatarEmoji( getAvatarEmoji(user) );

        return userDto.build();
    }

    @Override
    public List<UserDto> toDtoList(List<User> users) {
        if ( users == null ) {
            return null;
        }

        List<UserDto> list = new ArrayList<UserDto>( users.size() );
        for ( User user : users ) {
            list.add( toDto( user ) );
        }

        return list;
    }
}
