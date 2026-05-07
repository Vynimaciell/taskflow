package com.taskflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

public class AuthDTO {

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    public static class RegisterRequest {

        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50)
        private String username;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, max = 100)
        private String password;
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest {

        @NotBlank
        private String username;

        @NotBlank
        private String password;
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private String token;
        private String username;
        private String email;
    }
}
