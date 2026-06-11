package derfeb.bloom.repo;

import derfeb.bloom.model.Employee;
import derfeb.bloom.model.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeRepoTest {

    @Mock
    private EmployeeRepo employeeRepo;

    @Test
    void testFindEmployeeByEmail() {
        // Arrange
        Employee expectedEmployee = Employee.builder()
                .name("John Doe")
                .email("john@example.com")
                .employeeCode("EMP001")
                .role(Role.ROLE_EMPLOYEE)
                .password("hashedPass")
                .isActive(true)
                .build();
        when(employeeRepo.findEmployeeByEmail("john@example.com")).thenReturn(Optional.of(expectedEmployee));

        // Act
        Optional<Employee> found = employeeRepo.findEmployeeByEmail("john@example.com");

        // Assert
        assertTrue(found.isPresent());
        assertEquals("John Doe", found.get().getName());
    }

    @Test
    void testCountByIsActiveTrue() {
        // Arrange
        when(employeeRepo.countByIsActiveTrue()).thenReturn(1L);

        // Act
        long count = employeeRepo.countByIsActiveTrue();

        // Assert
        assertEquals(1, count);
    }
}
