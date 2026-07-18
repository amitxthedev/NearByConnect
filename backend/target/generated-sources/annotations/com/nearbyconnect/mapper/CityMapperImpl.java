package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.CityDto;
import com.nearbyconnect.entity.City;
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
public class CityMapperImpl implements CityMapper {

    @Override
    public CityDto toDto(City city) {
        if ( city == null ) {
            return null;
        }

        CityDto.CityDtoBuilder cityDto = CityDto.builder();

        cityDto.country( city.getCountry() );
        cityDto.id( city.getId() );
        cityDto.latitude( city.getLatitude() );
        cityDto.longitude( city.getLongitude() );
        cityDto.name( city.getName() );
        cityDto.state( city.getState() );

        cityDto.communityCount( city.getCommunities() != null ? city.getCommunities().size() : 0 );
        cityDto.userCount( city.getUsers() != null ? city.getUsers().size() : 0 );

        return cityDto.build();
    }

    @Override
    public List<CityDto> toDtoList(List<City> cities) {
        if ( cities == null ) {
            return null;
        }

        List<CityDto> list = new ArrayList<CityDto>( cities.size() );
        for ( City city : cities ) {
            list.add( toDto( city ) );
        }

        return list;
    }
}
