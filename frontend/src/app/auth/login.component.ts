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
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-primary">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-5 col-lg-4">
            <div class="card shadow-2xl border-0 rounded-4 overflow-hidden">
              <div class="bg-gradient-primary p-5 text-center text-white">
                <i class="bi bi-flower1 fs-1 mb-3"></i>
                <h2 class="fw-bold mb-0">Welcome Back</h2>
                <p class="mb-0 opacity-90">Sign in to your Bloom Manager account</p>
              </div>
              <div class="card-body p-5">
                <form (ngSubmit)="onLogin()">
                  <div class="mb-4">
                    <label class="form-label fw-medium">Email</label>
                    <div class="input-group input-group-lg">
                      <span class="input-group-text bg-light border-end-0">
                        <i class="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        class="form-control border-start-0 ps-0"
                        [(ngModel)]="credentials.email"
                        name="email"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div class="mb-5">
                    <label class="form-label fw-medium">Password</label>
                    <div class="input-group input-group-lg">
                      <span class="input-group-text bg-light border-end-0">
                        <i class="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        [type]="showPassword ? 'text' : 'password'"
                        class="form-control border-start-0 ps-0 border-end-0"
                        [(ngModel)]="credentials.password"
                        name="password"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        class="btn btn-outline-secondary border-start-0"
                        type="button"
                        (click)="showPassword = !showPassword"
                      >
                        <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                      </button>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-gradient-primary btn-lg w-100 fw-medium shadow-sm mb-4">
                Sign In
              </button>
                </form>
                <div class="text-center">
                  <p class="mb-0 text-muted">Don't have an account?
                    <a routerLink="/signup" class="text-primary fw-semibold text-decoration-none">Sign up</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      .bg-gradient-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .btn-gradient-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .btn-gradient-primary:hover {
        background: linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.4);
      }
      .shadow-2xl {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }
    </style>
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
