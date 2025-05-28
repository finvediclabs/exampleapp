package com.blog.controller;

import com.blog.dto.PostDTO;
import com.blog.mapper.EntityMapper;
import com.blog.model.Post;
import com.blog.model.User;
import com.blog.repository.PostRepository;
import com.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final EntityMapper entityMapper;

    public static class PostResponse {
        private Long id;
        private String title;
        private String content;
        private String category;
        private List<String> tags;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private AuthorResponse author;

        public static PostResponse fromPost(Post post) {
            PostResponse response = new PostResponse();
            response.setId(post.getId());
            response.setTitle(post.getTitle());
            response.setContent(post.getContent());
            response.setCategory(post.getCategory());
            response.setTags(post.getTags());
            response.setCreatedAt(post.getCreatedAt());
            response.setUpdatedAt(post.getUpdatedAt());
            response.setAuthor(AuthorResponse.fromUser(post.getAuthor()));
            return response;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public List<String> getTags() { return tags; }
        public void setTags(List<String> tags) { this.tags = tags; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
        public AuthorResponse getAuthor() { return author; }
        public void setAuthor(AuthorResponse author) { this.author = author; }
    }

    public static class AuthorResponse {
        private Long id;
        private String username;

        public static AuthorResponse fromUser(User user) {
            AuthorResponse response = new AuthorResponse();
            response.setId(user.getId());
            response.setUsername(user.getUsername());
            return response;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
    }

    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        List<PostDTO> posts = postRepository.findAll().stream()
                .map(entityMapper::toPostDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(entityMapper::toPostDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PostDTO> createPost(@RequestBody Post post) {
        // For now, we'll use the first user (admin) as the author
        User author = userRepository.findByUsername("admin")
                .orElseGet(() -> {
                    User admin = new User();
                    admin.setUsername("admin");
                    admin.setEmail("admin@example.com");
                    admin.setPassword("admin");
                    return userRepository.save(admin);
                });
        
        post.setAuthor(author);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        Post savedPost = postRepository.save(post);
        return ResponseEntity.ok(entityMapper.toPostDTO(savedPost));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(@PathVariable Long id, @RequestBody Post post) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        post.setId(id);
        post.setUpdatedAt(LocalDateTime.now());
        Post updatedPost = postRepository.save(post);
        return ResponseEntity.ok(entityMapper.toPostDTO(updatedPost));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        postRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/category/{category}")
    public List<PostResponse> getPostsByCategory(@PathVariable String category) {
        return postRepository.findByCategory(category).stream()
            .map(PostResponse::fromPost)
            .collect(Collectors.toList());
    }

    @GetMapping("/tag/{tag}")
    public List<PostResponse> getPostsByTag(@PathVariable String tag) {
        return postRepository.findByTagsContaining(tag).stream()
            .map(PostResponse::fromPost)
            .collect(Collectors.toList());
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<PostResponse>> getPostsByAuthor(@PathVariable Long authorId) {
        return userRepository.findById(authorId)
                .map(user -> ResponseEntity.ok(
                    postRepository.findByAuthor(user).stream()
                        .map(PostResponse::fromPost)
                        .collect(Collectors.toList())
                ))
                .orElse(ResponseEntity.notFound().build());
    }
} 