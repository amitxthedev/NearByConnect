package com.nearbyconnect.repository;

import com.nearbyconnect.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByCommunityIdOrderByCreatedAtDesc(Long communityId, Pageable pageable);
    Page<Post> findByAuthorIdOrderByCreatedAtDesc(Long authorId, Pageable pageable);
    Page<Post> findByCommunityIdAndIsPinnedTrueOrderByCreatedAtDesc(Long communityId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.community.id IN :communityIds ORDER BY p.createdAt DESC")
    Page<Post> findByCommunityIds(@Param("communityIds") List<Long> communityIds, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.community.id IN :communityIds ORDER BY p.likeCount DESC, p.createdAt DESC")
    List<Post> findTrendingByCommunityIds(@Param("communityIds") List<Long> communityIds, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.title LIKE %:query% OR p.content LIKE %:query% OR p.hashtags LIKE %:query%")
    Page<Post> search(@Param("query") String query, Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.hashtags h WHERE h = :hashtag")
    Page<Post> findByHashtag(@Param("hashtag") String hashtag, Pageable pageable);

    long countByCommunityId(Long communityId);
    long countByAuthorId(Long authorId);

    @Query("SELECT p FROM Post p WHERE p.community.city.id = :cityId ORDER BY p.likeCount DESC, p.createdAt DESC")
    Page<Post> findByCommunityCityIdOrderByLikeCountDesc(@Param("cityId") Long cityId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.community.city.id = :cityId ORDER BY p.createdAt DESC")
    Page<Post> findByCommunityCityIdOrderByCreatedAtDesc(@Param("cityId") Long cityId, Pageable pageable);

    long countByCreatedAtAfter(java.time.LocalDateTime date);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.community.city.id = :cityId")
    long countByCommunityCityId(@Param("cityId") Long cityId);
}
