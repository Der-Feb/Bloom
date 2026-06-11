import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="min-vh-100 bg-light">
      <nav class="navbar navbar-expand-lg navbar-dark bg-gradient-primary shadow-lg mb-4" *ngIf="authService.isLoggedIn()">
        <div class="container">
          <a class="navbar-brand fw-bold d-flex align-items-center fs-4" routerLink="/">
            <div class="bg-white text-primary d-flex align-items-center justify-content-center rounded-circle me-3" style="width: 40px; height: 40px;">
              <i class="bi bi-flower1 fs-5"></i>
            </div>
            Bloom Manager
          </a>
          <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto ms-4 gap-2">
              <li class="nav-item">
                <a class="nav-link px-4 py-2 d-flex align-items-center rounded-3" routerLink="/tasks" routerLinkActive="active">
                  <i class="bi bi-list-check me-2 fs-5"></i> Tasks
                </a>
              </li>
              <li class="nav-item" *ngIf="authService.isManager()">
                <a class="nav-link px-4 py-2 d-flex align-items-center rounded-3" routerLink="/employees" routerLinkActive="active">
                  <i class="bi bi-people-fill me-2 fs-5"></i> Employees
                </a>
              </li>
            </ul>
            <div class="d-flex align-items-center gap-3">
              <div class="text-light d-flex align-items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-3">
                <div class="bg-white text-primary d-flex align-items-center justify-content-center rounded-circle" style="width: 36px; height: 36px;">
                  <span class="fw-bold fs-6">{{ (authService.currentUser()?.name || 'U').charAt(0).toUpperCase() }}</span>
                </div>
                <span class="fw-medium">{{ authService.currentUser()?.name }}</span>
              </div>
              <button class="btn btn-light btn-sm px-4 py-2 shadow-sm fw-medium" (click)="onLogout()">
                <i class="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div class="pb-5">
        <router-outlet></router-outlet>
      </div>
    </div>

    <style>
      .bg-gradient-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .nav-link {
        transition: all 0.3s ease;
      }
      .nav-link:hover {
        background: rgba(255,255,255,0.15);
        border-radius: 0.75rem;
      }
      .nav-link.active {
        background: rgba(255,255,255,0.25);
        border-radius: 0.75rem;
      }
    </style>
  `
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
