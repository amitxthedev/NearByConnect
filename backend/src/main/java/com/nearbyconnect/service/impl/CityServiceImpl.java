package com.nearbyconnect.service.impl;

import com.nearbyconnect.dto.CityDto;
import com.nearbyconnect.entity.City;
import com.nearbyconnect.mapper.CityMapper;
import com.nearbyconnect.repository.CityRepository;
import com.nearbyconnect.service.CityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CityServiceImpl implements CityService {

    private final CityRepository cityRepository;
    private final CityMapper cityMapper;

    @Override
    public List<CityDto> getAllCities() {
        List<City> cities = cityRepository.findByIsActiveTrue();
        return cityMapper.toDtoList(cities);
    }

    @Override
    public CityDto getCityById(Long id) {
        City city = cityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("City not found with id: " + id));
        return cityMapper.toDto(city);
    }

    @Override
    public List<CityDto> searchCities(String query) {
        List<City> cities = cityRepository.findByNameContainingIgnoreCase(query);
        return cityMapper.toDtoList(cities);
    }

    @Override
    public List<String> getCountries() {
        return cityRepository.findDistinctCountries();
    }

    @Override
    public List<CityDto> getCitiesByCountry(String country) {
        List<City> cities = cityRepository.findByCountryIgnoreCaseAndIsActiveTrueOrderByCountryAscNameAsc(country);
        return cityMapper.toDtoList(cities);
    }
}
