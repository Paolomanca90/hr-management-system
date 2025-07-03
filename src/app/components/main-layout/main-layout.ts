import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { ThemeService, Theme } from '../../services/theme.service';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
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
  currentTheme: Theme = 'auto';
  
  menuItems: MenuItem[] = [
    { icon: 'fas fa-tachometer-alt', label: 'Dashboard', route: '/app/dashboard' },
    { icon: 'fas fa-users', label: 'Dipendenti', route: '/app/employees' },
    { icon: 'fas fa-money-check-alt', label: 'Buste Paga', route: '/app/payroll' },
    { icon: 'fas fa-chart-bar', label: 'Report', route: '/app/reports' },
    { icon: 'fas fa-cog', label: 'Impostazioni', route: '/app/settings' }
  ];

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  toggleTheme(): void {
    this.themeService.animateThemeChange();
    this.themeService.toggleTheme();
  }

  getThemeIcon(): string {
    return this.themeService.getThemeIcon();
  }

  getThemeLabel(): string {
    return this.themeService.getThemeLabel();
  }

  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  logout(): void {
    this.authService.logout();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}