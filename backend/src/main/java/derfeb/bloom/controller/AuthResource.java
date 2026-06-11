package derfeb.bloom.controller;

import derfeb.bloom.dto.AuthResponse;
import derfeb.bloom.dto.LoginRequest;
import derfeb.bloom.model.Employee;
import derfeb.bloom.repo.EmployeeRepo;
import derfeb.bloom.security.JwtUtils;
import derfeb.bloom.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthResource {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmployeeRepo employeeRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signup")
    public ResponseEntity<Employee> signup(@RequestBody Employee employee) {
        if (employeeRepo.findEmployeeByEmail(employee.getEmail()).isPresent()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Employee newEmployee = employeeService.addEmployee(employee);
        return new ResponseEntity<>(newEmployee, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        Employee employee = employeeRepo.findEmployeeByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (passwordEncoder.matches(loginRequest.getPassword(), employee.getPassword())) {
            String token = jwtUtils.generateToken(employee.getEmail());
            return new ResponseEntity<>(new AuthResponse(token, employee), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}
