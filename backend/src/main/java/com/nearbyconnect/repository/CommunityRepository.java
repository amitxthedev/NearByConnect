package com.nearbyconnect.repository;

import com.nearbyconnect.entity.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
    List<Community> findByCityIdOrderByMemberCountDesc(Long cityId);
    Page<Community> findByCityId(Long cityId, Pageable pageable);
    Page<Community> findByIsPublicTrue(Pageable pageable);
    List<Community> findByInterestIdAndCityId(Long interestId, Long cityId);

    @Query("SELECT c FROM Community c WHERE c.name LIKE %:query% OR c.description LIKE %:query%")
    Page<Community> search(@Param("query") String query, Pageable pageable);

    @Query("SELECT c FROM Community c WHERE c.city.id = :cityId ORDER BY c.memberCount DESC")
    List<Community> findTrendingByCity(@Param("cityId") Long cityId, Pageable pageable);

    long countByCityId(Long cityId);

    @Query("SELECT c FROM Community c WHERE c.city.id = :cityId ORDER BY c.memberCount DESC")
    Page<Community> findByCityIdOrderByMemberCountDesc(@Param("cityId") Long cityId, Pageable pageable);
}
