package derfeb.bloom.repo;

import derfeb.bloom.model.Employee;
import derfeb.bloom.model.Task;
import derfeb.bloom.model.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepo extends JpaRepository<Task, Long> {
    List<Task> findByAssignedEmployeesContaining(Employee employee);
    List<Task> findByCreatedBy(Employee manager);

    @Query("SELECT t FROM Task t WHERE " +
           "(:keyword = '' OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (cast(:date as date) IS NULL OR t.taskDate = :date) " +
           "AND (:employeeId IS NULL " +
           "     OR (:employeeId = -1 AND t.assignedEmployees IS EMPTY) " +
           "     OR (:employeeId > 0 AND EXISTS (SELECT e FROM t.assignedEmployees e WHERE e.id = :employeeId)))")
    Page<Task> findTasksWithFilters(
        @Param("keyword") String keyword, 
        @Param("status") TaskStatus status, 
        @Param("date") LocalDate date,
        @Param("employeeId") Long employeeId,
        Pageable pageable
    );

    @Query("SELECT t FROM Task t WHERE " +
           "(EXISTS (SELECT e FROM t.assignedEmployees e WHERE e.id = :employeeId) OR t.assignedEmployees IS EMPTY) " +
           "AND (:keyword = '' OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (cast(:date as date) IS NULL OR t.taskDate = :date)")
    Page<Task> findEmployeeTasksWithFilters(
        @Param("employeeId") Long employeeId,
        @Param("keyword") String keyword, 
        @Param("status") TaskStatus status, 
        @Param("date") LocalDate date,
        Pageable pageable
    );
}
