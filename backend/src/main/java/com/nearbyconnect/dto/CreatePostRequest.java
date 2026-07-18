package com.nearbyconnect.dto;

import com.nearbyconnect.enums.PostType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {
    private String title;

    @Size(max = 10000, message = "Content must be less than 10000 characters")
    private String content;

    private PostType postType;
    private Long communityId;
    private String hashtags;
}
