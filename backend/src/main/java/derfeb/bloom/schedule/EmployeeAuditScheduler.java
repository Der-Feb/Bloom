package derfeb.bloom.schedule;

import derfeb.bloom.repo.EmployeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EmployeeAuditScheduler {

    private final EmployeeRepo  employeeRepo;

    @Autowired
    public EmployeeAuditScheduler(EmployeeRepo employeeRepo) {
        this.employeeRepo = employeeRepo;
    }

    /**
     * Runs every day at midnight (00:00:00) to audit employee rosters.
     * Cron pattern: (Seconds Minutes Hours Day-of-Month Month Day-of-Week)
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void runDailyRosterAudit() {
        long activeCount = employeeRepo.countByIsActiveTrue();
        long totalCount = employeeRepo.count();
        long inactiveCount = totalCount - activeCount;

        System.out.println("[CRON SYSTEM AUDIT] Executed at: " + LocalDateTime.now());
        System.out.println("[AUDIT REPORT] Total: " + totalCount + " | Active: " + activeCount + " | Deactivated: " + inactiveCount);
        
        // This is where you would place logic to clean up old records 
        // or auto-expire temp employee codes using only the fields you have.
    }

    /**
     * Testing Heartbeat: Runs every 5 minutes during development 
     * just to print a clean status log to your console.
     */
    @Scheduled(fixedRate = 300000)
    public void devHeartbeatCheck() {
        System.out.println("[HEARTBEAT] Cron utility is running. Database connection stable.");
    }
}