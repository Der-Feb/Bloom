import { Component, OnInit } from "@angular/core";
import { IEmployee } from "../employee";
import { EmployeeService } from "../employee.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.css']
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

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadJobTitles();
  }

  loadEmployees(): void {

    this.isLoaded = false;

    this.employeeService.getEmployees(
      this.currentPage,
      this.pageSize,
      this.keyword,
      this.selectedJobTitle,
      this.sortBy,
      this.direction
    ).subscribe(response => {

      this.employees = response.content;
      this.totalPages = response.totalPages;

      this.isLoaded = true;
    });
  }

  loadJobTitles(): void {
    this.employeeService.getJobTitles()
      .subscribe(response => {
        this.jobTitles = response;
      });
  }

  search(): void {
    this.currentPage = 0;
    this.loadEmployees();
  }

  changePage(page: number): void {

    if (page < 0 || page >= this.totalPages) {
      return;
    }

    this.currentPage = page;

    this.loadEmployees();
  }

  sort(field: string): void {

    if (this.sortBy === field) {
      this.direction =
        this.direction === 'asc'
          ? 'desc'
          : 'asc';
    } else {
      this.sortBy = field;
      this.direction = 'asc';
    }

    this.loadEmployees();
  }

  clearFilters(): void {

    this.keyword = '';
    this.selectedJobTitle = '';

    this.loadEmployees();
  }
}