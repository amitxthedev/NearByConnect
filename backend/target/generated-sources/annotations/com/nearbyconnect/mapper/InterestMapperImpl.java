package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.InterestDto;
import com.nearbyconnect.entity.Interest;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-18T03:35:37+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class InterestMapperImpl implements InterestMapper {

    @Override
    public InterestDto toDto(Interest interest) {
        if ( interest == null ) {
            return null;
        }

        InterestDto.InterestDtoBuilder interestDto = InterestDto.builder();

        interestDto.category( interest.getCategory() );
        interestDto.icon( interest.getIcon() );
        interestDto.id( interest.getId() );
        interestDto.name( interest.getName() );

        interestDto.userCount( interest.getUsers() != null ? interest.getUsers().size() : 0 );

        return interestDto.build();
    }

    @Override
    public List<InterestDto> toDtoList(List<Interest> interests) {
        if ( interests == null ) {
            return null;
        }

        List<InterestDto> list = new ArrayList<InterestDto>( interests.size() );
        for ( Interest interest : interests ) {
            list.add( toDto( interest ) );
        }

        return list;
    }
}
