package com.taskflow.service;

import com.taskflow.dto.TaskDTO;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.TaskPriority;
import com.taskflow.enums.TaskStatus;
import com.taskflow.exception.GlobalExceptionHandler.ResourceNotFoundException;
import com.taskflow.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private User testUser;
    private Task testTask;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).username("testuser").email("test@mail.com").build();
        testTask = Task.builder()
            .id(1L).title("Test Task").description("Test desc")
            .status(TaskStatus.TODO).priority(TaskPriority.HIGH)
            .tags(List.of("Backend")).user(testUser)
            .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
            .build();
    }

    @Test
    @DisplayName("Should return all tasks for a user")
    void getAllTasks_ReturnsUserTasks() {
        when(taskRepository.findByUserIdOrderByDisplayOrderAsc(1L)).thenReturn(List.of(testTask));

        List<TaskDTO.Response> result = taskService.getAllTasks(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Test Task");
        verify(taskRepository).findByUserIdOrderByDisplayOrderAsc(1L);
    }

    @Test
    @DisplayName("Should create a new task")
    void createTask_SavesAndReturns() {
        TaskDTO.CreateRequest request = TaskDTO.CreateRequest.builder()
            .title("New Task").description("New desc")
            .status(TaskStatus.TODO).priority(TaskPriority.MEDIUM)
            .tags(List.of("Frontend")).build();

        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        TaskDTO.Response result = taskService.createTask(request, testUser);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Test Task");
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    @DisplayName("Should move task to new status")
    void moveTask_UpdatesStatus() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        Task movedTask = Task.builder()
            .id(1L).title("Test Task").status(TaskStatus.IN_PROGRESS)
            .priority(TaskPriority.HIGH).tags(List.of("Backend")).user(testUser)
            .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build();
        when(taskRepository.save(any(Task.class))).thenReturn(movedTask);

        TaskDTO.MoveRequest request = new TaskDTO.MoveRequest();
        request.setStatus(TaskStatus.IN_PROGRESS);

        TaskDTO.Response result = taskService.moveTask(1L, request, 1L);

        assertThat(result.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
    }

    @Test
    @DisplayName("Should throw when task not found")
    void getTaskById_NotFound_Throws() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTaskById(99L, 1L))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Should delete task")
    void deleteTask_RemovesFromRepo() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));

        taskService.deleteTask(1L, 1L);

        verify(taskRepository).delete(testTask);
    }
}
