package com.nearbyconnect.repository;

import com.nearbyconnect.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    List<City> findByIsActiveTrue();
    Optional<City> findByNameIgnoreCase(String name);
    List<City> findByNameContainingIgnoreCase(String name);
    List<City> findByCountryIgnoreCaseAndIsActiveTrueOrderByCountryAscNameAsc(String country);
    @Query("SELECT DISTINCT c.country FROM City c WHERE c.isActive = true ORDER BY c.country")
    List<String> findDistinctCountries();
}
