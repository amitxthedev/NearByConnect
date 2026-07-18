package com.nearbyconnect.repository;

import com.nearbyconnect.entity.ChatRoomMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Long> {
    Optional<ChatRoomMember> findByChatRoomIdAndUserId(Long chatRoomId, Long userId);
    boolean existsByChatRoomIdAndUserId(Long chatRoomId, Long userId);
    List<ChatRoomMember> findByChatRoomId(Long chatRoomId);
    long countByChatRoomId(Long chatRoomId);
    @Query("SELECT crm.user.id FROM ChatRoomMember crm WHERE crm.chatRoom.id = :chatRoomId AND crm.isOnline = true")
    List<Long> findOnlineUserIdsByChatRoomId(@Param("chatRoomId") Long chatRoomId);
    @Query("SELECT crm.chatRoom.id FROM ChatRoomMember crm WHERE crm.user.id = :userId")
    List<Long> findChatRoomIdsByUserId(@Param("userId") Long userId);
}
