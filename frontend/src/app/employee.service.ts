import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { IEmployee } from './employee';
import { environment } from '../environments/environment.development';
import { Page } from './page';

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
    direction: string,
  ): Observable<Page<IEmployee>> {
    // Spring Data Pageable parses sorting params natively via: "property,asc|desc"
    const sortValue = `${sortBy},${direction}`;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sortValue);

    if (keyword) {
      params = params.set('keyword', keyword);
    }

    if (jobTitle) {
      params = params.set('jobTitle', jobTitle);
    }

    console.log(
      `[EmployeeService] Fetching employees: page=${page}, size=${size}, sort=${sortValue}`,
      { keyword, jobTitle },
    );

    return this.http.get<Page<IEmployee>>(`${this.apiServerUrl}/employee`, { params }).pipe(
      tap((response) => console.log('[EmployeeService] Fetching employees SUCCESS:', response)),
      catchError((error) => {
        console.error('[EmployeeService] Fetching employees FAILED:', error);
        return throwError(() => error);
      }),
    );
  }

  public getJobTitles(): Observable<string[]> {
    console.log('[EmployeeService] Fetching distinct job titles...');
    return this.http.get<string[]>(`${this.apiServerUrl}/employee/job-titles`).pipe(
      tap((response) => console.log('[EmployeeService] Fetching job titles SUCCESS:', response)),
      catchError((error) => {
        console.error('[EmployeeService] Fetching job titles FAILED:', error);
        return throwError(() => error);
      }),
    );
  }

  public addEmployee(employee: IEmployee): Observable<IEmployee> {
    console.log('[EmployeeService] Sending payload to add employee:', employee);
    return this.http.post<IEmployee>(`${this.apiServerUrl}/employee`, employee).pipe(
      tap((response) => console.log('[EmployeeService] Add employee SUCCESS:', response)),
      catchError((error) => {
        console.error('[EmployeeService] Add employee FAILED:', error);
        return throwError(() => error);
      }),
    );
  }

  public updateEmployee(employee: IEmployee): Observable<IEmployee> {
    console.log('[EmployeeService] Sending payload to update employee:', employee);
    return this.http.put<IEmployee>(`${this.apiServerUrl}/employee`, employee).pipe(
      tap((response) => console.log('[EmployeeService] Update employee SUCCESS:', response)),
      catchError((error) => {
        console.error('[EmployeeService] Update employee FAILED:', error);
        return throwError(() => error);
      }),
    );
  }

  public deleteEmployee(employeeId: string): Observable<void> {
    console.log(`[EmployeeService] Requesting deletion for employee ID: ${employeeId}`);
    return this.http.delete<void>(`${this.apiServerUrl}/employee/${employeeId}`).pipe(
      tap(() => console.log(`[EmployeeService] Delete employee ID ${employeeId} SUCCESS`)),
      catchError((error) => {
        console.error(`[EmployeeService] Delete employee ID ${employeeId} FAILED:`, error);
        return throwError(() => error);
      }),
    );
  }
}
