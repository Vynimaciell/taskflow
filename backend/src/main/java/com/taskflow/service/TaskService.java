package com.taskflow.service;

import com.taskflow.dto.TaskDTO;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.TaskStatus;
import com.taskflow.exception.GlobalExceptionHandler.ResourceNotFoundException;
import com.taskflow.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    // ===== CRUD =====

    @Transactional(readOnly = true)
    public List<TaskDTO.Response> getAllTasks(Long userId) {
        return taskRepository.findByUserIdOrderByDisplayOrderAsc(userId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDTO.Response> getFilteredTasks(Long userId, TaskStatus status, String tag) {
        return taskRepository.findFiltered(userId, status, tag)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskDTO.Response getTaskById(Long taskId, Long userId) {
        Task task = findTaskByIdAndUser(taskId, userId);
        return toResponse(task);
    }

    @Transactional
    public TaskDTO.Response createTask(TaskDTO.CreateRequest request, User user) {
        Task task = Task.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .status(request.getStatus())
            .priority(request.getPriority())
            .displayOrder(request.getDisplayOrder())
            .tags(request.getTags() != null ? request.getTags() : new ArrayList<>())
            .user(user)
            .build();

        return toResponse(taskRepository.save(task));
    }

    @Transactional
    public TaskDTO.Response updateTask(Long taskId, TaskDTO.UpdateRequest request, Long userId) {
        Task task = findTaskByIdAndUser(taskId, userId);

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getDisplayOrder() != null) task.setDisplayOrder(request.getDisplayOrder());
        if (request.getTags() != null) task.setTags(request.getTags());

        return toResponse(taskRepository.save(task));
    }

    @Transactional
    public TaskDTO.Response moveTask(Long taskId, TaskDTO.MoveRequest request, Long userId) {
        Task task = findTaskByIdAndUser(taskId, userId);
        task.setStatus(request.getStatus());
        if (request.getDisplayOrder() != null) task.setDisplayOrder(request.getDisplayOrder());
        return toResponse(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long taskId, Long userId) {
        Task task = findTaskByIdAndUser(taskId, userId);
        taskRepository.delete(task);
    }

    // ===== Stats =====

    @Transactional(readOnly = true)
    public TaskStats getStats(Long userId) {
        long total = taskRepository.findByUserIdOrderByDisplayOrderAsc(userId).size();
        long done = taskRepository.countByUserIdAndStatus(userId, TaskStatus.DONE);
        long inProgress = taskRepository.countByUserIdAndStatus(userId, TaskStatus.IN_PROGRESS);
        long todo = taskRepository.countByUserIdAndStatus(userId, TaskStatus.TODO);
        long review = taskRepository.countByUserIdAndStatus(userId, TaskStatus.REVIEW);
        return new TaskStats(total, todo, inProgress, review, done);
    }

    public record TaskStats(long total, long todo, long inProgress, long review, long done) {}

    // ===== Helpers =====

    private Task findTaskByIdAndUser(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));
        if (!task.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Task not found: " + taskId);
        }
        return task;
    }

    private TaskDTO.Response toResponse(Task task) {
        return TaskDTO.Response.builder()
            .id(task.getId())
            .title(task.getTitle())
            .description(task.getDescription())
            .status(task.getStatus())
            .priority(task.getPriority())
            .displayOrder(task.getDisplayOrder())
            .tags(task.getTags())
            .createdAt(task.getCreatedAt())
            .updatedAt(task.getUpdatedAt())
            .build();
    }
}
