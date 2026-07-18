package com.nearbyconnect.controller;

import com.nearbyconnect.dto.InterestDto;
import com.nearbyconnect.service.InterestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/v1/interests")
@RequiredArgsConstructor
public class InterestController {

    private final InterestService interestService;

    @GetMapping
    public ResponseEntity<List<InterestDto>> getAllInterests() {
        return ResponseEntity.ok(interestService.getAllInterests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterestDto> getInterestById(@PathVariable Long id) {
        return ResponseEntity.ok(interestService.getInterestById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<InterestDto>> searchInterests(@RequestParam String q) {
        return ResponseEntity.ok(interestService.searchInterests(q));
    }
}
