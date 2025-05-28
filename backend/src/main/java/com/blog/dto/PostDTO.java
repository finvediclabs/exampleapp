package com.blog.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostDTO {
    private Long id;
    private String title;
    private String content;
    private String category;
    private UserDTO author;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 