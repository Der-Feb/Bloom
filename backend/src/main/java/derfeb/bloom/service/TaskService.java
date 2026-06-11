package derfeb.bloom.service;

import derfeb.bloom.model.Employee;
import derfeb.bloom.model.Task;
import derfeb.bloom.model.TaskStatus;
import derfeb.bloom.repo.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class TaskService {
    private final TaskRepo taskRepo;

    @Autowired
    public TaskService(TaskRepo taskRepo) {
        this.taskRepo = taskRepo;
    }

    public Task addTask(Task task) {
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.PENDING);
        }
        return taskRepo.save(task);
    }

    public List<Task> findAllTasks() {
        return taskRepo.findAll();
    }

    public List<Task> findTasksByEmployee(Employee employee) {
        return taskRepo.findByAssignedEmployeesContaining(employee);
    }

    public List<Task> findTasksByManager(Employee manager) {
        return taskRepo.findByCreatedBy(manager);
    }

    public Page<Task> findTasksFiltered(String keyword, TaskStatus status, LocalDate date, Long employeeId, Pageable pageable) {
        return taskRepo.findTasksWithFilters(keyword, status, date, employeeId, pageable);
    }

    public Page<Task> findEmployeeTasksFiltered(Long employeeId, String keyword, TaskStatus status, LocalDate date, Pageable pageable) {
        return taskRepo.findEmployeeTasksWithFilters(employeeId, keyword, status, date, pageable);
    }

    public Task updateTask(Task task) {
        return taskRepo.save(task);
    }

    public void deleteTask(Long id) {
        taskRepo.deleteById(id);
    }

    public Task findTaskById(Long id) {
        return taskRepo.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public void updateTasksStatusByDeadline() {
        List<Task> tasks = taskRepo.findAll();
        LocalDate today = LocalDate.now();
        for (Task task : tasks) {
            if (task.getStatus() != TaskStatus.COMPLETED && 
                task.getStatus() != TaskStatus.ABORTED && 
                task.getTaskDate().isBefore(today)) {
                task.setStatus(TaskStatus.ABORTED);
                taskRepo.save(task);
            }
        }
    }
}
