package com.taskflow.controller;

import com.taskflow.dto.TaskDTO;
import com.taskflow.entity.User;
import com.taskflow.enums.TaskStatus;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<TaskDTO.Response>> getAllTasks(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String tag) {

        User user = getUser(userDetails);

        List<TaskDTO.Response> tasks = (status != null || tag != null)
            ? taskService.getFilteredTasks(user.getId(), status, tag)
            : taskService.getAllTasks(user.getId());

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO.Response> getTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.getTaskById(id, getUser(userDetails).getId()));
    }

    @PostMapping
    public ResponseEntity<TaskDTO.Response> createTask(
            @Valid @RequestBody TaskDTO.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(taskService.createTask(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO.Response> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskDTO.UpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.updateTask(id, request, getUser(userDetails).getId()));
    }

    @PatchMapping("/{id}/move")
    public ResponseEntity<TaskDTO.Response> moveTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskDTO.MoveRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.moveTask(id, request, getUser(userDetails).getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        taskService.deleteTask(id, getUser(userDetails).getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<TaskService.TaskStats> getStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.getStats(getUser(userDetails).getId()));
    }

    private User getUser(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
