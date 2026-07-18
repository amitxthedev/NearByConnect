package com.nearbyconnect.repository;

import com.nearbyconnect.entity.CommunityMember;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityMemberRepository extends JpaRepository<CommunityMember, Long> {
    Optional<CommunityMember> findByCommunityIdAndUserId(Long communityId, Long userId);
    boolean existsByCommunityIdAndUserId(Long communityId, Long userId);
    Page<CommunityMember> findByUserId(Long userId, Pageable pageable);
    List<CommunityMember> findByCommunityId(Long communityId);
    long countByCommunityId(Long communityId);

    @Query("SELECT cm.community.id FROM CommunityMember cm WHERE cm.user.id = :userId")
    List<Long> findCommunityIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT cm.user.id FROM CommunityMember cm WHERE cm.community.id = :communityId")
    List<Long> findUserIdsByCommunityId(@Param("communityId") Long communityId);

    Page<CommunityMember> findByCommunityIdOrderByJoinedAtDesc(Long communityId, Pageable pageable);
}
