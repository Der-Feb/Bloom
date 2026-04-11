package derfeb.bloom.service;

import derfeb.bloom.exception.UserNotFoundException;
import derfeb.bloom.model.Employee;
import derfeb.bloom.repo.EmployeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
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

    public List<Employee> findAllEmployee() {
        return employeeRepo.findAll();
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
