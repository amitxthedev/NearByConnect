package com.nearbyconnect.mapper;

import com.nearbyconnect.dto.InterestDto;
import com.nearbyconnect.entity.Interest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface InterestMapper {
    @Mapping(target = "userCount", expression = "java(interest.getUsers() != null ? interest.getUsers().size() : 0)")
    InterestDto toDto(Interest interest);

    List<InterestDto> toDtoList(List<Interest> interests);
}
