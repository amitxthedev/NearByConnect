package com.nearbyconnect.service;

import com.nearbyconnect.dto.NotificationDto;
import com.nearbyconnect.dto.PageResponse;

public interface NotificationService {
    PageResponse<NotificationDto> getNotifications(int page, int size);
    long getUnreadCount();
    void markAsRead(Long notificationId);
    void markAllAsRead();
}
