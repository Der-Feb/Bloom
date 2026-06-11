import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-primary py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6">
            <div class="card shadow-2xl border-0 rounded-4 overflow-hidden">
              <div class="bg-gradient-primary p-4 text-center text-white">
                <i class="bi bi-flower1 fs-1 mb-2"></i>
                <h2 class="fw-bold mb-0">Create Account</h2>
                <p class="mb-0 opacity-90">Join Bloom Manager today</p>
              </div>
              <div class="card-body p-5">
                <form (ngSubmit)="onSignup()">
                  <div class="row g-3 mb-3">
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Full Name</label>
                      <div class="input-group input-group-lg">
                        <span class="input-group-text bg-light border-end-0">
                          <i class="bi bi-person text-muted"></i>
                        </span>
                        <input
                          type="text"
                          class="form-control border-start-0 ps-0"
                          [(ngModel)]="user.name"
                          name="name"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Email</label>
                      <div class="input-group input-group-lg">
                        <span class="input-group-text bg-light border-end-0">
                          <i class="bi bi-envelope text-muted"></i>
                        </span>
                        <input
                          type="email"
                          class="form-control border-start-0 ps-0"
                          [(ngModel)]="user.email"
                          name="email"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row g-3 mb-3">
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Password</label>
                      <div class="input-group input-group-lg">
                        <span class="input-group-text bg-light border-end-0">
                          <i class="bi bi-lock text-muted"></i>
                        </span>
                        <input
                          [type]="showPassword ? 'text' : 'password'"
                          class="form-control border-start-0 ps-0 border-end-0"
                          [(ngModel)]="user.password"
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
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Phone</label>
                      <div class="input-group input-group-lg">
                        <span class="input-group-text bg-light border-end-0">
                          <i class="bi bi-telephone text-muted"></i>
                        </span>
                        <input
                          type="text"
                          class="form-control border-start-0 ps-0"
                          [(ngModel)]="user.phone"
                          name="phone"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row g-3 mb-4">
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Job Title</label>
                      <div class="input-group input-group-lg">
                        <span class="input-group-text bg-light border-end-0">
                          <i class="bi bi-briefcase text-muted"></i>
                        </span>
                        <input
                          type="text"
                          class="form-control border-start-0 ps-0"
                          [(ngModel)]="user.jobTitle"
                          name="jobTitle"
                          placeholder="Software Engineer"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Role</label>
                      <div class="input-group input-group-lg">
                        <span class="input-group-text bg-light border-end-0">
                          <i class="bi bi-person-badge text-muted"></i>
                        </span>
                        <select class="form-select border-start-0 ps-0" [(ngModel)]="user.role" name="role" required>
                          <option value="ROLE_EMPLOYEE">Employee</option>
                          <option value="ROLE_MANAGER">Manager</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-gradient-primary btn-lg w-100 fw-medium shadow-sm mb-4">
            Create Account
          </button>
                </form>
                <div class="text-center">
                  <p class="mb-0 text-muted">Already have an account?
                    <a routerLink="/login" class="text-primary fw-semibold text-decoration-none">Sign in</a>
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
export class SignupComponent {
  user: any = { role: 'ROLE_EMPLOYEE' };
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSignup() {
    this.authService.signup(this.user).subscribe({
      next: () => {
        alert('Signup successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => alert('Signup failed: ' + err.message),
    });
  }
}
