import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { ITask } from './task';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  public getAllTasks(
    keyword: string = '',
    status: string = '',
    date: string = '',
    employeeId: string = '',
    page: number = 0,
    size: number = 10,
  ): Observable<any> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    if (status) params = params.set('status', status);
    if (date) params = params.set('date', date);
    if (employeeId) params = params.set('employeeId', employeeId);
    return this.http.get<any>(`${this.apiServerUrl}/task/all`, { params });
  }

  public getTasksByEmployee(
    employeeId: number,
    keyword: string = '',
    status: string = '',
    date: string = '',
    page: number = 0,
    size: number = 10,
  ): Observable<any> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    if (status) params = params.set('status', status);
    if (date) params = params.set('date', date);
    return this.http.get<any>(`${this.apiServerUrl}/task/employee/${employeeId}`, { params });
  }

  public addTask(task: Partial<ITask>): Observable<ITask> {
    return this.http.post<ITask>(`${this.apiServerUrl}/task/add`, task);
  }

  public updateTask(task: ITask): Observable<ITask> {
    return this.http.put<ITask>(`${this.apiServerUrl}/task/update`, task);
  }

  public deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/task/delete/${taskId}`);
  }
}
