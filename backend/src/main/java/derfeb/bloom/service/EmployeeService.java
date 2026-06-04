package derfeb.bloom.service;

import derfeb.bloom.exception.UserNotFoundException;
import derfeb.bloom.model.Employee;
import derfeb.bloom.repo.EmployeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class EmployeeService {
    private final EmployeeRepo employeeRepo;

    @Autowired
    public EmployeeService(EmployeeRepo employeeRepo) {
        this.employeeRepo = employeeRepo;
    }

    public Employee addEmployee(Employee employee) {
        employee.setEmployeeCode(UUID.randomUUID().toString());
        return employeeRepo.save(employee);
    }

    // Accept filtering strings directly from your Resource controller mapping
    public Page<Employee> findEmployeesPaged(String keyword, String jobTitle, Pageable pageable) {
        return employeeRepo.findEmployeesWithFilters(keyword, jobTitle, pageable);
    }

    public List<String> getDistinctJobTitles() {
        return employeeRepo.findDistinctJobTitles();
    }

    public Employee updateEmployee(Employee employee) {
        return employeeRepo.save(employee);
    }

    public Employee findEmployeeById(Long employeeId) {
        return employeeRepo.findEmployeeById(employeeId)
                .orElseThrow(() -> new UserNotFoundException("User with id " + employeeId + " not found."));
    }

    public void deleteEmployee(Long employeeId) {
        employeeRepo.deleteEmployeeById(employeeId);
    }
}