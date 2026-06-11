import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4" *ngIf="authService.isLoggedIn()">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Bloom Manager</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/tasks" routerLinkActive="active">Tasks</a>
            </li>
            <li class="nav-item" *ngIf="authService.isManager()">
              <a class="nav-link" routerLink="/employees" routerLinkActive="active">Employees</a>
            </li>
          </ul>
          <div class="d-flex align-items-center">
            <span class="text-light me-3">Welcome, {{ authService.currentUser()?.name }}</span>
            <button class="btn btn-outline-light btn-sm" (click)="onLogout()">Logout</button>
          </div>
        </div>
      </div>
    </nav>
    
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
