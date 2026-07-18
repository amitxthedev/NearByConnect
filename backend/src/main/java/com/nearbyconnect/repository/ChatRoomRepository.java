package com.nearbyconnect.repository;

import com.nearbyconnect.entity.ChatRoom;
import com.nearbyconnect.enums.ChatRoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findFirstByCommunityIdOrderByIdAsc(Long communityId);
    List<ChatRoom> findByChatRoomType(ChatRoomType type);
    Page<ChatRoom> findByChatRoomType(ChatRoomType type, Pageable pageable);

    @Query("SELECT cr FROM ChatRoom cr JOIN cr.members m WHERE m.user.id = :userId")
    List<ChatRoom> findByMemberUserId(@Param("userId") Long userId);

    @Query("SELECT cr FROM ChatRoom cr WHERE cr.chatRoomType = 'PRIVATE' AND cr.id IN (SELECT crm.chatRoom.id FROM ChatRoomMember crm WHERE crm.user.id = :userId1) AND cr.id IN (SELECT crm2.chatRoom.id FROM ChatRoomMember crm2 WHERE crm2.user.id = :userId2)")
    Optional<ChatRoom> findPrivateChatRoom(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
