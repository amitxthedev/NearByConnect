package com.nearbyconnect.service;

import com.nearbyconnect.dto.CityDto;
import java.util.List;

public interface CityService {
    List<CityDto> getAllCities();
    CityDto getCityById(Long id);
    List<CityDto> searchCities(String query);
    List<String> getCountries();
    List<CityDto> getCitiesByCountry(String country);
}
