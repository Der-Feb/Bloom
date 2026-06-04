package derfeb.bloom.repo;

import derfeb.bloom.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepo extends JpaRepository<Employee, Long> {
    
    void deleteEmployeeById(Long id);
    
    Optional<Employee> findEmployeeById(Long id);

    @Query("SELECT DISTINCT e.jobTitle FROM Employee e WHERE e.jobTitle IS NOT NULL")
    List<String> findDistinctJobTitles();

    // Add this query to handle optional filters cleanly when they are empty strings
    @Query("SELECT e FROM Employee e WHERE " +
           "(:keyword = '' OR LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(e.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:jobTitle = '' OR e.jobTitle = :jobTitle)")
    Page<Employee> findEmployeesWithFilters(
        @Param("keyword") String keyword, 
        @Param("jobTitle") String jobTitle, 
        Pageable pageable
    );

    long countByIsActiveTrue();
}