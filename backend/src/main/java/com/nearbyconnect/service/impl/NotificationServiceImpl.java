package com.nearbyconnect.service.impl;

import com.nearbyconnect.dto.NotificationDto;
import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.entity.Notification;
import com.nearbyconnect.mapper.NotificationMapper;
import com.nearbyconnect.repository.NotificationRepository;
import com.nearbyconnect.security.SecurityUtils;
import com.nearbyconnect.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Override
    public PageResponse<NotificationDto> getNotifications(int page, int size) {
        Long userId = getCurrentUserId();
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId, pageable);
        return PageResponse.<NotificationDto>builder()
                .content(notificationMapper.toDtoList(notifications.getContent()))
                .page(notifications.getNumber())
                .size(notifications.getSize())
                .totalElements(notifications.getTotalElements())
                .totalPages(notifications.getTotalPages())
                .isFirst(notifications.isFirst())
                .isLast(notifications.isLast())
                .build();
    }

    @Override
    public long getUnreadCount() {
        return notificationRepository.countByRecipientIdAndIsReadFalse(getCurrentUserId());
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead() {
        notificationRepository.markAllAsReadByUserId(getCurrentUserId());
    }

    private Long getCurrentUserId() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("User not authenticated");
        }
        return userId;
    }
}
