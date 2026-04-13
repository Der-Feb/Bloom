import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IEmployee } from "./employee";
import { environment } from "../environments/environment.development";

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    private apiServerUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) {}

    public getEmployees(): Observable<IEmployee[]> {
        return this.http.get<IEmployee[]>(`${this.apiServerUrl}/employee/`)
    }
    
    public addEmployee(employee: IEmployee): Observable<IEmployee> {
        return this.http.post<IEmployee>(`${this.apiServerUrl}/employee/`, employee);
    }

    public updateEmployee(employee: IEmployee): Observable<IEmployee> {
        return this.http.put<IEmployee>(`${this.apiServerUrl}/employee/`, employee);
    }

    public deleteEmployee(employeeId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/employee/${employeeId}`);
    }    
}
