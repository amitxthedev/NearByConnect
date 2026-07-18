package com.nearbyconnect.repository;

import com.nearbyconnect.entity.User;
import com.nearbyconnect.enums.AccountStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByAnonymousName(String anonymousName);
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByAnonymousName(String anonymousName);
    Page<User> findByCityId(Long cityId, Pageable pageable);
    List<User> findByCityId(Long cityId);
    Page<User> findByAccountStatus(AccountStatus status, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.anonymousName LIKE %:query%")
    Page<User> searchByAnonymousName(@Param("query") String query, Pageable pageable);

    long countByCityId(Long cityId);
}
