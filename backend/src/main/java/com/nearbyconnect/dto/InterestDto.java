package com.nearbyconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterestDto {
    private Long id;
    private String name;
    private String icon;
    private String category;
    private int userCount;
}
