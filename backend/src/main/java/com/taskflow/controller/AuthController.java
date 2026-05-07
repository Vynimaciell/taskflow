package com.taskflow.controller;

import com.taskflow.config.JwtUtils;
import com.taskflow.dto.AuthDTO;
import com.taskflow.entity.User;
import com.taskflow.exception.GlobalExceptionHandler.DuplicateResourceException;
import com.taskflow.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<AuthDTO.AuthResponse> register(@Valid @RequestBody AuthDTO.RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .build();

        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getUsername());

        return ResponseEntity.ok(AuthDTO.AuthResponse.builder()
            .token(token)
            .username(user.getUsername())
            .email(user.getEmail())
            .build());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDTO.AuthResponse> login(@Valid @RequestBody AuthDTO.LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtUtils.generateToken(request.getUsername());
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();

        return ResponseEntity.ok(AuthDTO.AuthResponse.builder()
            .token(token)
            .username(user.getUsername())
            .email(user.getEmail())
            .build());
    }
}
