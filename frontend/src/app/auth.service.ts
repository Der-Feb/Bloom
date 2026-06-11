import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment.development';
import { IEmployee } from './employee';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiServerUrl = environment.apiBaseUrl;
  
  currentUser = signal<IEmployee | null>(null);

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  signup(employee: Partial<IEmployee>): Observable<IEmployee> {
    return this.http.post<IEmployee>(`${this.apiServerUrl}/auth/signup`, employee);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/auth/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUser.set(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isManager(): boolean {
    return this.currentUser()?.role === 'ROLE_MANAGER';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
