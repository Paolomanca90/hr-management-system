import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';

export interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-main-layout',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    MatBadgeModule,
    RouterLink,
    RouterLinkActive,
    RouterModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout implements OnInit {
  currentUser: User | null = null;
  sidenavOpened = true;
  
  menuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/app/dashboard' },
    { icon: 'people', label: 'Dipendenti', route: '/app/employees' },
    { icon: 'account_balance_wallet', label: 'Buste Paga', route: '/app/payroll' },
    { icon: 'assessment', label: 'Report', route: '/app/reports' },
    { icon: 'settings', label: 'Impostazioni', route: '/app/settings' }
  ];

  constructor(
    private authService: AuthService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  logout(): void {
    this.authService.logout();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
