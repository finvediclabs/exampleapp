package com.blog.mapper;

import com.blog.dto.PostDTO;
import com.blog.dto.UserDTO;
import com.blog.model.Post;
import com.blog.model.User;
import org.springframework.stereotype.Component;

@Component
public class EntityMapper {
    
    public UserDTO toUserDTO(User user) {
        if (user == null) return null;
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        return dto;
    }

    public PostDTO toPostDTO(Post post) {
        if (post == null) return null;
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setCategory(post.getCategory());
        dto.setAuthor(toUserDTO(post.getAuthor()));
        dto.setTags(post.getTags());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        return dto;
    }
} 