package com.nearbyconnect.repository;

import com.nearbyconnect.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByChatRoomIdOrderByCreatedAtDesc(Long chatRoomId, Pageable pageable);
    List<Message> findByChatRoomIdOrderByCreatedAtAsc(Long chatRoomId);
    Optional<Message> findFirstByChatRoomIdOrderByCreatedAtDesc(Long chatRoomId);
    long countByChatRoomId(Long chatRoomId);
    List<Message> findByChatRoomIdAndIsPinnedTrue(Long chatRoomId);
}
