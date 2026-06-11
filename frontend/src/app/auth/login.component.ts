import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <div class="card shadow">
            <div class="card-header bg-primary text-white text-center">
              <h3>Login</h3>
            </div>
            <div class="card-body">
              <form (ngSubmit)="onLogin()">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    [(ngModel)]="credentials.email"
                    name="email"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <div class="input-group">
                    <input
                      [type]="showPassword ? 'text' : 'password'"
                      class="form-control"
                      [(ngModel)]="credentials.password"
                      name="password"
                      required
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      (click)="showPassword = !showPassword"
                    >
                      <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </button>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
              </form>
              <div class="mt-3 text-center">
                <p>Don't have an account? <a routerLink="/signup">Signup</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLogin() {
    this.authService.login(this.credentials).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: (err: any) => alert('Login failed: ' + err.message),
    });
  }
}
