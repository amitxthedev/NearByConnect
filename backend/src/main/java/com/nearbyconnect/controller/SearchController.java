package com.nearbyconnect.controller;

import com.nearbyconnect.dto.SearchResultDto;
import com.nearbyconnect.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<SearchResultDto> search(
            @RequestParam String q,
            @RequestParam(required = false) Long cityId) {
        return ResponseEntity.ok(searchService.search(q, cityId));
    }
}
