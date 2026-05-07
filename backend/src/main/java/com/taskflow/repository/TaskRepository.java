package com.taskflow.repository;

import com.taskflow.entity.Task;
import com.taskflow.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserIdOrderByDisplayOrderAsc(Long userId);

    List<Task> findByUserIdAndStatusOrderByDisplayOrderAsc(Long userId, TaskStatus status);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:tag IS NULL OR :tag MEMBER OF t.tags) " +
           "ORDER BY t.displayOrder ASC")
    List<Task> findFiltered(
        @Param("userId") Long userId,
        @Param("status") TaskStatus status,
        @Param("tag") String tag
    );

    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") TaskStatus status);
}
