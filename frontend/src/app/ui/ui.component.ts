import { Component, OnInit } from "@angular/core";
import { IEmployee } from "../employee";
import { EmployeeService } from "../employee.service";
import { HttpErrorResponse } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule, 
        FormsModule
    ],
    templateUrl: './ui.component.html',
    styleUrls: ['./ui.component.css']
})
export class UIComponent implements OnInit {
    public employees: IEmployee[] = [];

    public editEmployee: IEmployee | null = null;
    public deleteEmployee: IEmployee | null = null;

    constructor(private employeeService: EmployeeService) {}

    ngOnInit(): void {
        this.getEmployees();
    }

    public getEmployees(): void {
        this.employeeService.getEmployees().subscribe(
            (response: IEmployee[]) => {
                console.log(response);
                this.employees = response;
            },
            (error: HttpErrorResponse) => {
                console.log(error);
            }
        )
    }

    public onOpenModal(employee: any, mode: string): void {
        const container = document.getElementById('main-container');
        const button = document.createElement('button');
        button.type = 'button';
        button.style.display = 'none';
        button.setAttribute('data-bs-toggle', 'modal');

        if (mode === 'add') {
            button.setAttribute('data-bs-target', '#addEmployeeModal');
        }
        if (mode === 'edit') {
            this.editEmployee = employee; // You'll need a variable for this
            button.setAttribute('data-bs-target', '#updateEmployeeModal');
        }
        if (mode === 'delete') {
            this.deleteEmployee = employee; // And this
            button.setAttribute('data-bs-target', '#deleteEmployeeModal');
        }

        container?.appendChild(button);
        button.click();
    }

    public searchEmployees(key: string): void {
        const results: IEmployee[] = [];
        for (const employee of this.employees) {
            if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
            || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
            || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
            || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
            results.push(employee);
            }
        }
        this.employees = results;
        if (results.length === 0 || !key) {
            this.getEmployees(); // Reset the list if search is empty or no results
        }
    }

}