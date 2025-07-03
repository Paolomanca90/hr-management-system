// app.routes.ts
import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { MainLayout } from './components/main-layout/main-layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Employees } from './components/employees/employees';
import { Payroll } from './components/payroll/payroll';
import { Reports } from './components/reports/reports';
import { Settings } from './components/settings/settings';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'app',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'employees', component: Employees },
      { path: 'payroll', component: Payroll },
      { path: 'reports', component: Reports },
      { path: 'settings', component: Settings }
    ]
  },
  { path: '**', redirectTo: '/login' }
];