package derfeb.bloom.service;

import derfeb.bloom.model.Employee;
import derfeb.bloom.model.Role;
import derfeb.bloom.repo.EmployeeRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepo employeeRepo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private EmployeeService employeeService;

    @Test
    void testAddEmployee_SetsDefaultIsActiveWhenNull() {
        // Arrange: Don't use builder here - set isActive to null explicitly
        Employee inputEmployee = new Employee();
        inputEmployee.setName("Jane Doe");
        inputEmployee.setEmail("jane@example.com");
        inputEmployee.setPassword("plainPassword");
        inputEmployee.setRole(Role.ROLE_EMPLOYEE);
        inputEmployee.setIsActive(null); // Important: set to null to trigger service default
        
        when(passwordEncoder.encode("plainPassword")).thenReturn("hashedPassword");
        when(employeeRepo.save(any(Employee.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Employee savedEmployee = employeeService.addEmployee(inputEmployee);

        // Assert
        assertNotNull(savedEmployee.getEmployeeCode());
        assertEquals("hashedPassword", savedEmployee.getPassword());
        assertTrue(savedEmployee.getIsActive()); // Service should set to true
        verify(passwordEncoder, times(1)).encode("plainPassword");
        verify(employeeRepo, times(1)).save(any(Employee.class));
    }

    @Test
    void testAddEmployee_PreservesExistingIsActive() {
        // Arrange
        Employee inputEmployee = Employee.builder()
                .name("John Smith")
                .email("john@example.com")
                .password("test123")
                .role(Role.ROLE_MANAGER)
                .isActive(false)
                .build();
        when(passwordEncoder.encode("test123")).thenReturn("hashed123");
        when(employeeRepo.save(any(Employee.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Employee savedEmployee = employeeService.addEmployee(inputEmployee);

        // Assert
        assertFalse(savedEmployee.getIsActive()); // Should stay false
    }
}