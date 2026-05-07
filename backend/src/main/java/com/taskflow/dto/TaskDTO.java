package com.taskflow.dto;

import com.taskflow.enums.TaskPriority;
import com.taskflow.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class TaskDTO {

    // ===== REQUEST =====

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class CreateRequest {

        @NotBlank(message = "Title is required")
        @Size(max = 200, message = "Title must be under 200 characters")
        private String title;

        @Size(max = 2000, message = "Description must be under 2000 characters")
        private String description;

        @NotNull(message = "Status is required")
        private TaskStatus status;

        @NotNull(message = "Priority is required")
        private TaskPriority priority;

        private Integer displayOrder;
        private List<String> tags;
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class UpdateRequest {

        @Size(max = 200)
        private String title;

        @Size(max = 2000)
        private String description;

        private TaskStatus status;
        private TaskPriority priority;
        private Integer displayOrder;
        private List<String> tags;
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class MoveRequest {

        @NotNull(message = "Target status is required")
        private TaskStatus status;

        private Integer displayOrder;
    }

    // ===== RESPONSE =====

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private TaskStatus status;
        private TaskPriority priority;
        private Integer displayOrder;
        private List<String> tags;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
