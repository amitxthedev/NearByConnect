package com.nearbyconnect.controller;

import com.nearbyconnect.dto.AnonymousIdentityRequest;
import com.nearbyconnect.dto.PageResponse;
import com.nearbyconnect.dto.UpdateProfileRequest;
import com.nearbyconnect.dto.UserDto;
import com.nearbyconnect.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getProfile(id));
    }

    @PostMapping("/identity")
    public ResponseEntity<UserDto> createIdentity(@Valid @RequestBody AnonymousIdentityRequest request) {
        return ResponseEntity.ok(userService.createAnonymousIdentity(request));
    }

    @PostMapping("/regenerate-name")
    public ResponseEntity<UserDto> regenerateName() {
        return ResponseEntity.ok(userService.regenerateAnonymousName());
    }

    @PutMapping("/interests")
    public ResponseEntity<UserDto> updateInterests(@RequestBody List<Long> interestIds) {
        return ResponseEntity.ok(userService.updateInterests(interestIds));
    }

    @PutMapping("/city/{cityId}")
    public ResponseEntity<UserDto> updateCity(@PathVariable Long cityId) {
        return ResponseEntity.ok(userService.updateCity(cityId));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<UserDto>> searchUsers(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(userService.searchUsers(q, page, size));
    }
}
