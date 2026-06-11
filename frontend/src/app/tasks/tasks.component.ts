import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../task.service';
import { AuthService } from '../auth.service';
import { EmployeeService } from '../employee.service';
import { ITask, TaskStatus } from '../task';
import { IEmployee } from '../employee';
import * as bootstrap from 'bootstrap';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit, OnDestroy {
  tasks: ITask[] = [];
  allEmployees: IEmployee[] = [];

  // Filters
  keyword = '';
  selectedStatus = '';
  selectedDate = '';
  selectedEmployeeId = '';
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // For creating/editing
  formTask: Partial<ITask> = {
    assignedEmployees: [],
  };

  isManager = false;
  currentUser: IEmployee | null = null;

  toastMessage = '';
  toastType: 'success' | 'danger' = 'success';

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    this.isManager = this.authService.isManager();
    this.loadTasks();
    if (this.isManager) {
      this.loadAllEmployees();
    }

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadTasks();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showToast(message: string, type: 'success' | 'danger' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.cdr.detectChanges();
    const toastEl = document.getElementById('taskToast');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
      toast.show();
    }
  }

  loadTasks(): void {
    const keyword = this.keyword.trim();
    if (this.isManager) {
      this.taskService
        .getAllTasks(keyword, this.selectedStatus, this.selectedDate, this.selectedEmployeeId)
        .subscribe((res) => {
          this.tasks = res.content || [];
        });
    } else if (this.currentUser?.id) {
      this.taskService
        .getTasksByEmployee(this.currentUser.id, keyword, this.selectedStatus, this.selectedDate)
        .subscribe((res) => {
          this.tasks = res.content || [];
        });
    }
  }

  search(): void {
    this.searchSubject.next(this.keyword);
  }

  clearFilters(): void {
    this.keyword = '';
    this.selectedStatus = '';
    this.selectedDate = '';
    this.selectedEmployeeId = '';
    this.loadTasks();
  }

  loadAllEmployees(): void {
    this.employeeService.getEmployees(0, 100, '', '', 'name', 'asc').subscribe((res) => {
      this.allEmployees = res.content || [];
    });
  }

  openAddModal(): void {
    this.formTask = {
      title: '',
      description: '',
      taskDate: '',
      status: TaskStatus.PENDING,
      createdBy: this.currentUser!,
      assignedEmployees: [],
    };
    const modal = new bootstrap.Modal(document.getElementById('taskModal')!);
    modal.show();
  }

  openEditModal(task: ITask): void {
    this.formTask = { ...task, assignedEmployees: [...task.assignedEmployees] };
    const modal = new bootstrap.Modal(document.getElementById('taskModal')!);
    modal.show();
  }

  submitTask(): void {
    if (this.formTask.id) {
      this.taskService.updateTask(this.formTask as ITask).subscribe({
        next: () => {
          this.showToast('Task updated successfully!');
          this.loadTasks();
          bootstrap.Modal.getInstance(document.getElementById('taskModal')!)?.hide();
        },
        error: () => this.showToast('Failed to update task.', 'danger'),
      });
    } else {
      this.taskService.addTask(this.formTask).subscribe({
        next: () => {
          this.showToast('Task created successfully!');
          this.loadTasks();
          bootstrap.Modal.getInstance(document.getElementById('taskModal')!)?.hide();
        },
        error: () => this.showToast('Failed to create task.', 'danger'),
      });
    }
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.showToast('Task deleted.');
          this.loadTasks();
        },
        error: () => this.showToast('Failed to delete task.', 'danger'),
      });
    }
  }

  toggleEmployeeAssignment(employee: IEmployee): void {
    const index = this.formTask.assignedEmployees?.findIndex((e) => e.id === employee.id);
    if (index !== undefined && index > -1) {
      this.formTask.assignedEmployees?.splice(index, 1);
    } else {
      this.formTask.assignedEmployees?.push(employee);
    }
  }

  isEmployeeSelected(employee: IEmployee): boolean {
    return !!this.formTask.assignedEmployees?.find((e) => e.id === employee.id);
  }

  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.PENDING:
        return 'bg-warning-subtle text-warning border border-warning-subtle';
      case TaskStatus.IN_PROGRESS:
        return 'bg-primary-subtle text-primary border border-primary-subtle';
      case TaskStatus.COMPLETED:
        return 'bg-success-subtle text-success border border-success-subtle';
      case TaskStatus.ABORTED:
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      default:
        return 'bg-dark-subtle text-dark border border-dark-subtle';
    }
  }

  markAsCompleted(task: ITask): void {
    task.status = TaskStatus.COMPLETED;
    this.taskService.updateTask(task).subscribe(() => this.loadTasks());
  }

  markAsAborted(task: ITask): void {
    task.status = TaskStatus.ABORTED;
    this.taskService.updateTask(task).subscribe(() => this.loadTasks());
  }
}
