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
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow">
            <div class="card-header bg-success text-white text-center">
              <h3>Signup</h3>
            </div>
            <div class="card-body">
              <form (ngSubmit)="onSignup()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Full Name</label>
                    <input
                      type="text"
                      class="form-control"
                      [(ngModel)]="user.name"
                      name="name"
                      required
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Email</label>
                    <input
                      type="email"
                      class="form-control"
                      [(ngModel)]="user.email"
                      name="email"
                      required
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Password</label>
                    <div class="input-group">
                      <input
                        [type]="showPassword ? 'text' : 'password'"
                        class="form-control"
                        [(ngModel)]="user.password"
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
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Phone</label>
                    <input type="text" class="form-control" [(ngModel)]="user.phone" name="phone" />
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Job Title</label>
                    <input
                      type="text"
                      class="form-control"
                      [(ngModel)]="user.jobTitle"
                      name="jobTitle"
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Role</label>
                    <select class="form-select" [(ngModel)]="user.role" name="role" required>
                      <option value="ROLE_EMPLOYEE">Employee</option>
                      <option value="ROLE_MANAGER">Manager</option>
                    </select>
                  </div>
                </div>
                <button type="submit" class="btn btn-success w-100 mt-3">Signup</button>
              </form>
              <div class="mt-3 text-center">
                <p>Already have an account? <a routerLink="/login">Login</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
