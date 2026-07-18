package com.nearbyconnect.repository;

import com.nearbyconnect.entity.Interest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InterestRepository extends JpaRepository<Interest, Long> {
    Optional<Interest> findByNameIgnoreCase(String name);
    List<Interest> findByCategory(String category);
    List<Interest> findByNameContainingIgnoreCase(String name);
}
