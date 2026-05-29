import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IEmployee } from "./employee";
import { environment } from "../environments/environment.development";
import { Page } from "./page";

@Injectable({ providedIn: 'root' })
export class EmployeeService {

    private apiServerUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) {}

    public getEmployees(
        page: number,
        size: number,
        keyword: string,
        jobTitle: string,
        sortBy: string,
        direction: string
    ): Observable<Page<IEmployee>> {

        let params = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('sortBy', sortBy)
            .set('direction', direction);

        if (keyword) {
            params = params.set('keyword', keyword);
        }

        if (jobTitle) {
            params = params.set('jobTitle', jobTitle);
        }

        return this.http.get<Page<IEmployee>>(
            `${this.apiServerUrl}/employee`,
            { params }
        );
    }

    public getJobTitles(): Observable<string[]> {
        return this.http.get<string[]>(
            `${this.apiServerUrl}/employee/job-titles`
        );
    }

    public addEmployee(employee: IEmployee): Observable<IEmployee> {
        return this.http.post<IEmployee>(
            `${this.apiServerUrl}/employee`,
            employee
        );
    }

    public updateEmployee(employee: IEmployee): Observable<IEmployee> {
        return this.http.put<IEmployee>(
            `${this.apiServerUrl}/employee`,
            employee
        );
    }

    public deleteEmployee(employeeId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiServerUrl}/employee/${employeeId}`
        );
    }
}