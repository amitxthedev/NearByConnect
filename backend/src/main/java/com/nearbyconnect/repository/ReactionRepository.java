package com.nearbyconnect.repository;

import com.nearbyconnect.entity.Reaction;
import com.nearbyconnect.enums.ReactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByUserIdAndPostId(Long userId, Long postId);
    boolean existsByUserIdAndPostId(Long userId, Long postId);
    long countByPostIdAndReactionType(Long postId, ReactionType type);
}
