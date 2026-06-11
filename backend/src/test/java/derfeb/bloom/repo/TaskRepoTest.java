package derfeb.bloom.repo;

import derfeb.bloom.model.Employee;
import derfeb.bloom.model.Role;
import derfeb.bloom.model.Task;
import derfeb.bloom.model.TaskStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskRepoTest {

    @Mock
    private TaskRepo taskRepo;

    @Test
    void testFindTasksWithFilters_WithKeyword() {
        Task task = Task.builder()
                .title("Test Task")
                .status(TaskStatus.PENDING)
                .taskDate(LocalDate.now())
                .build();

        Page<Task> page = new PageImpl<>(Collections.singletonList(task));

        when(taskRepo.findTasksWithFilters(
                eq("Test"),
                any(),
                any(),
                any(),
                any(PageRequest.class)
        )).thenReturn(page);

        Page<Task> result = taskRepo.findTasksWithFilters(
                "Test",
                null,
                null,
                null,
                PageRequest.of(0, 10)
        );

        assertFalse(result.isEmpty());
        assertEquals("Test Task", result.getContent().get(0).getTitle());
    }

    @Test
    void testFindTasksWithFilters_WithEmployeeId() {
        Employee employee = Employee.builder()
                .id(1L)
                .name("John Doe")
                .email("john@example.com")
                .role(Role.ROLE_EMPLOYEE)
                .password("password")
                .isActive(true)
                .build();

        Task task = Task.builder()
                .title("Assigned Task")
                .status(TaskStatus.IN_PROGRESS)
                .taskDate(LocalDate.now())
                .assignedEmployees(Collections.singleton(employee))
                .build();

        Page<Task> page = new PageImpl<>(Collections.singletonList(task));

        when(taskRepo.findTasksWithFilters(
                eq(""),
                any(),
                any(),
                eq(1L),
                any(PageRequest.class)
        )).thenReturn(page);

        Page<Task> result = taskRepo.findTasksWithFilters(
                "",
                null,
                null,
                1L,
                PageRequest.of(0, 10)
        );

        assertEquals(1, result.getTotalElements());
    }
}
