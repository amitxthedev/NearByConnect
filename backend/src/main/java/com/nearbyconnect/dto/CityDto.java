package com.nearbyconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CityDto {
    private Long id;
    private String name;
    private String state;
    private String country;
    private Double latitude;
    private Double longitude;
    private int communityCount;
    private int userCount;
}
