package derfeb.bloom.service;

import derfeb.bloom.model.Task;
import derfeb.bloom.model.TaskStatus;
import derfeb.bloom.repo.TaskRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepo taskRepo;

    @InjectMocks
    private TaskService taskService;

    @Test
    void testAddTask_SetsDefaultStatusWhenNull() {
        Task input = Task.builder()
                .title("Test Task")
                .taskDate(LocalDate.now())
                .status(null)
                .build();

        when(taskRepo.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Task result = taskService.addTask(input);
        assertNotNull(result);
        assertEquals(TaskStatus.PENDING, result.getStatus());
    }

    @Test
    void testUpdateTask_SavesTaskSuccessfully() {
        Task update = Task.builder()
                .id(1L)
                .title("New Title")
                .description("New Desc")
                .status(TaskStatus.IN_PROGRESS)
                .taskDate(LocalDate.now())
                .build();

        when(taskRepo.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Task result = taskService.updateTask(update);

        assertEquals("New Title", result.getTitle());
        assertEquals("New Desc", result.getDescription());
        assertEquals(TaskStatus.IN_PROGRESS, result.getStatus());
    }

    @Test
    void testFindTaskById_ReturnsExistingTask() {
        Task existing = Task.builder()
                .id(1L)
                .title("Find Me")
                .status(TaskStatus.PENDING)
                .taskDate(LocalDate.now())
                .build();

        when(taskRepo.findById(1L)).thenReturn(Optional.of(existing));

        Task result = taskService.findTaskById(1L);
        assertNotNull(result);
        assertEquals("Find Me", result.getTitle());
    }

    @Test
    void testUpdateTasksStatusByDeadline_AbortsOverdueTasks() {
        Task overdue = Task.builder()
                .id(1L)
                .title("Overdue")
                .status(TaskStatus.PENDING)
                .taskDate(LocalDate.now().minusDays(2))
                .build();

        when(taskRepo.findAll()).thenReturn(java.util.Collections.singletonList(overdue));

        taskService.updateTasksStatusByDeadline();
        verify(taskRepo, times(1)).save(overdue);
        assertEquals(TaskStatus.ABORTED, overdue.getStatus());
    }
}
