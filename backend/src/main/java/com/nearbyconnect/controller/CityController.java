package com.nearbyconnect.controller;

import com.nearbyconnect.dto.CityDto;
import com.nearbyconnect.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/v1/cities")
@RequiredArgsConstructor
public class CityController {

    private final CityService cityService;

    @GetMapping
    public ResponseEntity<List<CityDto>> getAllCities() {
        return ResponseEntity.ok(cityService.getAllCities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CityDto> getCityById(@PathVariable Long id) {
        return ResponseEntity.ok(cityService.getCityById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<CityDto>> searchCities(@RequestParam String q) {
        return ResponseEntity.ok(cityService.searchCities(q));
    }

    @GetMapping("/countries")
    public ResponseEntity<List<String>> getCountries() {
        return ResponseEntity.ok(cityService.getCountries());
    }

    @GetMapping("/country/{country}")
    public ResponseEntity<List<CityDto>> getCitiesByCountry(@PathVariable String country) {
        return ResponseEntity.ok(cityService.getCitiesByCountry(country));
    }
}
