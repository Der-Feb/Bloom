import { Routes } from '@angular/router';
import { UIComponent } from './ui/ui.component';
import { TasksComponent } from './tasks/tasks.component';
import { LoginComponent } from './auth/login.component';
import { SignupComponent } from './auth/signup.component';
import { authGuard, managerGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { 
    path: 'employees', 
    component: UIComponent, 
    canActivate: [authGuard, managerGuard] 
  },
  { 
    path: 'tasks', 
    component: TasksComponent, 
    canActivate: [authGuard] 
  },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: '**', redirectTo: '/tasks' }
];
