import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { IEmployee } from "../employee";
import { EmployeeService } from "../employee.service";
import { HttpErrorResponse } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.css'],
  template: `
    <h1>Testing</h1>
  `
})
export class UIComponent implements OnInit {

  public employees: IEmployee[] = [];
  private allEmployees: IEmployee[] = [];
  public isLoaded = false;

  public editEmployee: IEmployee | null = null;
  public deleteEmployee: IEmployee | null = null;

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.isLoaded = false;

    this.employeeService.getEmployees().subscribe(
      (response: IEmployee[]) => {
        this.allEmployees = response;
        this.employees = response;
        this.isLoaded = true;
        this.cdr.detectChanges();
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.isLoaded = true;
        this.cdr.detectChanges();
      }
    );
  }

  public searchEmployees(key: string): void {
    if (!key || key.trim() === '') {
      this.employees = this.allEmployees;
      return;
    }

    const lowerKey = key.toLowerCase();

    this.employees = this.allEmployees.filter(emp =>
      emp.name.toLowerCase().includes(lowerKey) ||
      emp.email.toLowerCase().includes(lowerKey) ||
      emp.phone.toLowerCase().includes(lowerKey) ||
      emp.jobTitle.toLowerCase().includes(lowerKey)
    );
  }

  public onOpenModal(employee: IEmployee | null, mode: string): void {

    this.editEmployee = null;
    this.deleteEmployee = null;

    const container = document.getElementById('main-container');
    const button = document.createElement('button');

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    if (mode === 'add') {
      button.setAttribute('data-bs-target', '#addEmployeeModal');
    }

    if (mode === 'edit' && employee) {
      this.editEmployee = { ...employee };
      button.setAttribute('data-bs-target', '#updateEmployeeModal');
    }

    if (mode === 'delete' && employee) {
      this.deleteEmployee = employee;
      button.setAttribute('data-bs-target', '#deleteEmployeeModal');
    }

    container?.appendChild(button);
    button.click();
  }

  public onAddEmployee(addForm: any): void {
    this.employeeService.addEmployee(addForm.value).subscribe(
      () => this.getEmployees(),
      (error: HttpErrorResponse) => alert(error.message)
    );
  }

  public onUpdateEmployee(employee: IEmployee): void {
    this.employeeService.updateEmployee(employee).subscribe(
      () => this.getEmployees(),
      (error: HttpErrorResponse) => alert(error.message)
    );
  }

  public onDeleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      () => this.getEmployees(),
      (error: HttpErrorResponse) => alert(error.message)
    );
  }
}