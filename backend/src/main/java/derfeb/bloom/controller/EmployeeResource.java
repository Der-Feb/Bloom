package derfeb.bloom.controller;

import derfeb.bloom.model.Employee;
import derfeb.bloom.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employee")
public class EmployeeResource {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeResource(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/ok")
    public ResponseEntity<String> checkHealthy() {
        return new ResponseEntity<>("Healthy", HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Page<Employee>> getAllEmployees(
            @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
            @RequestParam(value = "jobTitle", required = false, defaultValue = "") String jobTitle,
            Pageable pageable) {
        Page<Employee> employees = employeeService.findEmployeesPaged(keyword, jobTitle, pageable);
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    @GetMapping("/job-titles")
    public ResponseEntity<List<String>> getJobTitles() {
        List<String> titles = employeeService.getDistinctJobTitles();
        return new ResponseEntity<>(titles, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeesById(@PathVariable("id") Long id) {
        Employee employee = employeeService.findEmployeeById(id);
        return new ResponseEntity<>(employee, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Employee> addEmployee(@RequestBody Employee employee) {
        // employeeCode is set in the service, never trust the client to send it
        employee.setEmployeeCode(null);
        Employee newEmployee = employeeService.addEmployee(employee);
        return new ResponseEntity<>(newEmployee, HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<Employee> updateEmployee(@RequestBody Employee employee) {
        // Prevent client from overwriting employeeCode or password if not provided
        Employee existing = employeeService.findEmployeeById(employee.getId());
        
        employee.setEmployeeCode(existing.getEmployeeCode());
        
        if (employee.getPassword() == null || employee.getPassword().isEmpty()) {
            employee.setPassword(existing.getPassword());
        }
        
        Employee updated = employeeService.updateEmployee(employee);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable("id") Long id) {
        employeeService.deleteEmployee(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}