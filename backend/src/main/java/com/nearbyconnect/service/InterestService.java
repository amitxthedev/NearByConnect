package com.nearbyconnect.service;

import com.nearbyconnect.dto.InterestDto;
import java.util.List;

public interface InterestService {
    List<InterestDto> getAllInterests();
    InterestDto getInterestById(Long id);
    List<InterestDto> searchInterests(String query);
}
