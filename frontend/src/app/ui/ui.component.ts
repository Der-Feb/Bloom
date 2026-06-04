import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IEmployee } from '../employee';
import { EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.css'],
})
export class UIComponent implements OnInit {
  employees: IEmployee[] = [];
  jobTitles: string[] = [];

  currentPage = 0;
  totalPages = 0;
  pageSize = 5;

  keyword = '';
  selectedJobTitle = '';

  sortBy = 'id';
  direction = 'asc';

  isLoaded = false;
  hasSearched = false;

  formEmployee: Partial<IEmployee> = {};
  selectedEmployee: IEmployee | null = null;

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadJobTitles();
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoaded = false;

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
      .subscribe({
        next: (response) => {
          if (response) {
            this.employees = response.content || [];
            this.totalPages = response.totalPages || 0;
          }
          this.isLoaded = true;
          this.hasSearched = true;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoaded = true;
          this.hasSearched = true;
          this.cdr.detectChanges();
          console.error('[UIComponent] Error loading employees:', err);
        },
      });
  }

  loadJobTitles(): void {
    this.employeeService.getJobTitles().subscribe({
      next: (response) => {
        this.jobTitles = response || [];
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

  sort(field: string): void {
    if (this.sortBy === field) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.direction = 'asc';
    }
    this.currentPage = 0;
    this.loadEmployees();
  }

  clearFilters(): void {
    this.keyword = '';
    this.selectedJobTitle = '';
    this.currentPage = 0;
    this.loadEmployees();
  }

  // ─── ADD ────────────────────────────────────────────────
  openAddModal(): void {
    this.formEmployee = { role: 'ROLE_EMPLOYEE', active: false };
    const modal = new bootstrap.Modal(document.getElementById('addModal')!);
    modal.show();
  }

  submitAdd(): void {
    this.employeeService.addEmployee(this.formEmployee as IEmployee).subscribe({
      next: () => {
        bootstrap.Modal.getInstance(document.getElementById('addModal')!)?.hide();
        this.loadEmployees();
        this.loadJobTitles();
      },
      error: (err) => console.error('[UIComponent] Add failed:', err),
    });
  }

  // ─── EDIT ───────────────────────────────────────────────
  openEditModal(employee: IEmployee): void {
    this.formEmployee = { ...employee };
    const modal = new bootstrap.Modal(document.getElementById('editModal')!);
    modal.show();
  }

  submitEdit(): void {
    this.employeeService.updateEmployee(this.formEmployee as IEmployee).subscribe({
      next: () => {
        bootstrap.Modal.getInstance(document.getElementById('editModal')!)?.hide();
        this.loadEmployees();
        this.loadJobTitles();
      },
      error: (err) => console.error('[UIComponent] Update failed:', err),
    });
  }

  // ─── DELETE ─────────────────────────────────────────────
  openDeleteModal(employee: IEmployee): void {
    this.selectedEmployee = employee;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal')!);
    modal.show();
  }

  submitDelete(): void {
    if (!this.selectedEmployee?.id) return;

    this.employeeService.deleteEmployee(String(this.selectedEmployee.id)).subscribe({
      next: () => {
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')!)?.hide();
        this.selectedEmployee = null;
        if (this.employees.length === 1 && this.currentPage > 0) {
          this.currentPage--;
        }
        this.loadEmployees();
      },
      error: (err) => console.error('[UIComponent] Delete failed:', err),
    });
  }
}
