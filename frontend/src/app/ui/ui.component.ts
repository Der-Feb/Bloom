import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IEmployee } from '../employee';
import { EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ui',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.css'],
})
export class UIComponent implements OnInit, OnDestroy {
  employees: IEmployee[] = [];
  jobTitles: string[] = [];

  currentPage = 0;
  totalPages = 0;
  pageSize = 12;

  keyword = '';
  selectedJobTitle = '';

  sortBy = 'id';
  direction = 'asc';

  isLoaded = false;
  hasSearched = false;

  formEmployee: Partial<IEmployee> = {};
  selectedEmployee: IEmployee | null = null;

  toastMessage = '';
  toastType: 'success' | 'danger' = 'success';

  private destroy$ = new Subject<void>();

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadJobTitles();
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEmployees(): void {
    this.isLoaded = false;
    this.cdr.detectChanges();

    const searchKeyword = (this.keyword || '').trim();
    const searchJobTitle = this.selectedJobTitle || '';

    this.employeeService
      .getEmployees(
        this.currentPage,
        this.pageSize,
        searchKeyword,
        searchJobTitle,
        this.sortBy,
        this.direction,
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('[UIComponent] Loaded employees:', res);
          if (res) {
            this.employees = [...(res.content || [])];
            this.totalPages = res.totalPages || 0;
          }
          this.isLoaded = true;
          this.hasSearched = true;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('[UIComponent] Error loading employees:', err);
          this.isLoaded = true;
          this.hasSearched = true;
          this.cdr.detectChanges();
        },
      });
  }

  loadJobTitles(): void {
    this.employeeService.getJobTitles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('[UIComponent] Loaded job titles:', res);
          this.jobTitles = [...(res || [])];
          this.cdr.detectChanges();
        },
        error: (err) => console.error('[UIComponent] Failed to fetch job titles:', err),
      });
  }

  search(): void {
    this.currentPage = 0;
    this.loadEmployees();
  }

  changePage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadEmployees();
  }



  clearFilters(): void {
    this.keyword = '';
    this.selectedJobTitle = '';
    this.sortBy = 'id';
    this.direction = 'asc';
    this.currentPage = 0;
    this.loadEmployees();
  }

  onPageSizeChange(): void {
    if (this.pageSize < 1) {
      this.pageSize = 1;
    }
    this.currentPage = 0;
    this.loadEmployees();
  }

  sort(column: string): void {
    if (this.sortBy === column) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.direction = 'asc';
    }
    this.currentPage = 0;
    this.loadEmployees();
  }

  showToast(message: string, type: 'success' | 'danger' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.cdr.detectChanges();
    const toastEl = document.getElementById('liveToast');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
      toast.show();
    }
  }

  openAddModal(): void {
    this.formEmployee = { role: 'ROLE_EMPLOYEE', active: false };
    const modal = new bootstrap.Modal(document.getElementById('addModal')!);
    modal.show();
  }

  submitAdd(): void {
    this.employeeService.addEmployee(this.formEmployee as IEmployee).subscribe({
      next: (res) => {
        bootstrap.Modal.getInstance(document.getElementById('addModal')!)?.hide();
        this.showToast(`Employee ${res.name} added successfully!`, 'success');
        this.loadEmployees();
        this.loadJobTitles();
      },
      error: (err) => {
        console.error('[UIComponent] Add failed:', err);
        this.showToast('Failed to add employee.', 'danger');
      },
    });
  }

  openEditModal(employee: IEmployee): void {
    this.formEmployee = { ...employee };
    const modal = new bootstrap.Modal(document.getElementById('editModal')!);
    modal.show();
  }

  submitEdit(): void {
    this.employeeService.updateEmployee(this.formEmployee as IEmployee).subscribe({
      next: (res) => {
        bootstrap.Modal.getInstance(document.getElementById('editModal')!)?.hide();
        this.showToast(`Employee ${res.name} updated successfully!`, 'success');
        this.loadEmployees();
        this.loadJobTitles();
      },
      error: (err) => {
        console.error('[UIComponent] Update failed:', err);
        this.showToast('Failed to update employee.', 'danger');
      },
    });
  }

  openDeleteModal(employee: IEmployee): void {
    this.selectedEmployee = employee;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal')!);
    modal.show();
  }

  submitDelete(): void {
    if (!this.selectedEmployee?.id) return;
    const name = this.selectedEmployee.name;

    this.employeeService.deleteEmployee(String(this.selectedEmployee.id)).subscribe({
      next: () => {
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')!)?.hide();
        this.showToast(`Employee ${name} deleted.`, 'success');
        this.selectedEmployee = null;
        if (this.employees.length === 1 && this.currentPage > 0) {
          this.currentPage--;
        }
        this.loadEmployees();
      },
      error: (err) => {
        console.error('[UIComponent] Delete failed:', err);
        this.showToast('Failed to delete employee.', 'danger');
      },
    });
  }
}
