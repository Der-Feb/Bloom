package derfeb.bloom.repo;

import derfeb.bloom.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepo extends JpaRepository<Employee, Long> {
    // query methods
    void deleteEmployeeById(Long id);
    Optional<Employee> findEmployeeById(Long id);
}
