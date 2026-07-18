package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.CityDto;
import com.nearbyconnect.entity.City;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CityMapper {
    @Mapping(target = "communityCount", expression = "java(city.getCommunities() != null ? city.getCommunities().size() : 0)")
    @Mapping(target = "userCount", expression = "java(city.getUsers() != null ? city.getUsers().size() : 0)")
    CityDto toDto(City city);

    List<CityDto> toDtoList(List<City> cities);
}
