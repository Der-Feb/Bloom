package derfeb.bloom.schedule;

import derfeb.bloom.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class BloomTaskScheduler {

    private final TaskService taskService;

    @Autowired
    public BloomTaskScheduler(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Runs every hour to check for task deadlines and update status to ABORTED if missed.
     */
    @Scheduled(cron = "0 0 * * * *")
    public void checkTaskDeadlines() {
        System.out.println("[TASK SCHEDULER] Checking deadlines at: " + LocalDateTime.now());
        taskService.updateTasksStatusByDeadline();
    }
}
