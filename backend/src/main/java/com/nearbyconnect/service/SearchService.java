package com.nearbyconnect.service;

import com.nearbyconnect.dto.SearchResultDto;

public interface SearchService {
    SearchResultDto search(String query, Long cityId);
}
