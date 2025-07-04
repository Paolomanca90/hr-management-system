import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { MenuService, MenuItem } from '../../services/menu.service';
import { ThemeService, Theme } from '../../services/theme.service';
import { Router, RouterOutlet, RouterModule, NavigationEnd } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, filter } from 'rxjs';

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
export class MainLayout implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentUser: User | null = null;
  sidenavOpened = true;
  currentTheme: Theme = 'auto';
  menuItems: MenuItem[] = [];
  isCompanyUser = false;

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private themeService: ThemeService,
    public router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to user changes
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        this.isCompanyUser = this.authService.isCompanyUser();
        this.loadMenu();
      });
    
    // Subscribe to theme changes
    this.themeService.currentTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
      });

    // Subscribe to router events to expand menu automatically
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.handleRouteChange(event.url);
      });

    this.loadMenu();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadMenu(): void {
    this.menuService.getMenuItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.menuItems = items;
      });
  }

  private handleRouteChange(url: string): void {
    // Find menu item that matches current route and expand its parents
    const matchingMenuItem = this.findMenuItemByRoute(this.menuItems, url);
    if (matchingMenuItem) {
      this.menuService.expandToMenuItem(matchingMenuItem.id);
      this.loadMenu(); // Reload to get updated expanded states
    }
  }

  private findMenuItemByRoute(items: MenuItem[], route: string): MenuItem | null {
    for (const item of items) {
      if (item.route === route) {
        return item;
      }
      if (item.children) {
        const found = this.findMenuItemByRoute(item.children, route);
        if (found) return found;
      }
    }
    return null;
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  toggleMenuItem(menuItem: MenuItem): void {
    if (menuItem.children && menuItem.children.length > 0) {
      this.menuService.toggleMenuItem(menuItem.id);
      this.loadMenu(); // Reload to get updated expanded states
    }
  }

  navigateToMenuItem(menuItem: MenuItem): void {
    if (menuItem.route) {
      this.router.navigate([menuItem.route]);
    } else if (menuItem.children && menuItem.children.length > 0) {
      this.toggleMenuItem(menuItem);
    }
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

  // Utility methods for template
  hasChildren(item: MenuItem): boolean {
    return !!(item.children && item.children.length > 0);
  }

  isMenuItemActive(item: MenuItem): boolean {
    if (item.route) {
      return this.router.url === item.route;
    }
    if (item.children) {
      return item.children.some(child => this.isMenuItemActive(child));
    }
    return false;
  }

  getMenuItemClasses(item: MenuItem): string {
    const classes = ['menu-item'];
    
    if (this.isMenuItemActive(item)) {
      classes.push('active');
    }
    
    if (item.disabled) {
      classes.push('disabled');
    }
    
    return classes.join(' ');
  }
}