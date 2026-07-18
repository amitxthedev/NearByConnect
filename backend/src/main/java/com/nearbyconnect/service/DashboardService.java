package com.nearbyconnect.service;

import com.nearbyconnect.dto.DashboardDto;

public interface DashboardService {
    DashboardDto getDashboard(Long cityId);
}
