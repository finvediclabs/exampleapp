package com.blog.config;

import com.blog.model.User;
import com.blog.model.Post;
import com.blog.repository.UserRepository;
import com.blog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@example.com");
        admin.setPassword(passwordEncoder.encode("admin"));
        userRepository.save(admin);

        // Create some test posts for admin
        Post post1 = new Post();
        post1.setTitle("Welcome to the Blog Platform");
        post1.setContent("This is our first blog post. We're excited to share our thoughts and ideas with you!");
        post1.setAuthor(admin);
        post1.setCategory("General");
        post1.setTags(Arrays.asList("welcome", "first-post"));
        postRepository.save(post1);

        Post post2 = new Post();
        post2.setTitle("Getting Started with Spring Boot");
        post2.setContent("Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications.");
        post2.setAuthor(admin);
        post2.setCategory("Technology");
        post2.setTags(Arrays.asList("spring-boot", "java", "tutorial"));
        postRepository.save(post2);
    }
} 