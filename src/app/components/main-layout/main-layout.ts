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
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        this.isCompanyUser = this.authService.isCompanyUser();
        this.loadMenu();
      });
    
    this.themeService.currentTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
      });

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
    const matchingMenuItem = this.findMenuItemByRoute(this.menuItems, url);
    if (matchingMenuItem) {
      this.menuService.expandToMenuItem(matchingMenuItem.id);
      this.loadMenu();
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

  toggleMenuItem(menuItem: MenuItem, event?: Event): void {
    if (event) {
      event.preventDefault(); // Previene il comportamento nativo di details/summary
      event.stopPropagation(); // Previene la propagazione dell'evento
    }
    if (menuItem.children && menuItem.children.length > 0) {
      this.menuService.toggleMenuItem(menuItem.id);
      this.loadMenu();
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

  hasChildren(item: MenuItem): boolean {
    return !!(item.children && item.children.length > 0);
  }

  isMenuItemActive(item: MenuItem): boolean {
    if (item.route) {
      // Controllo esatto per route dirette
      if (this.router.url === item.route) {
        return true;
      }
      
      // Controllo per route simili (es. /app/employees vs /app/employees/something)
      if (this.router.url.startsWith(item.route + '/')) {
        return true;
      }
      
      // Controllo speciale per items "diretti" nella sidebar collassata
      if (item.id.includes('-direct')) {
        const baseRoute = item.route?.split('/')[2];
        const currentRoute = this.router.url.split('/')[2];
        return baseRoute === currentRoute;
      }
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

  // Ottieni menu items intelligenti per la sidebar collassata
  getMainMenuItems(): MenuItem[] {
    const intelligentItems: MenuItem[] = [];
    
    if (this.isCompanyUser) {
      // Per utenti aziendali, crea items diretti dalle funzioni più usate
      intelligentItems.push(
        { id: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard', route: '/app/dashboard' },
        { id: 'employees-direct', icon: 'fas fa-users', label: 'Dipendenti', route: '/app/employees' },
        { id: 'attendance-direct', icon: 'fas fa-clock', label: 'Presenze', route: '/app/attendance/archives' },
        { id: 'payroll-direct', icon: 'fas fa-money-check-alt', label: 'Buste Paga', route: '/app/payroll' },
        { id: 'reports-direct', icon: 'fas fa-chart-bar', label: 'Report', route: '/app/reports' },
        { id: 'settings-direct', icon: 'fas fa-cog', label: 'Impostazioni', route: '/app/settings' }
      );
    } else {
      // Per dipendenti, usa i menu esistenti ma con route dirette alle funzioni principali
      intelligentItems.push(
        { id: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard', route: '/app/dashboard' },
        { id: 'canteen-direct', icon: 'fas fa-utensils', label: 'Mensa', route: '/app/canteen/tables' },
        { id: 'projects-direct', icon: 'fas fa-briefcase', label: 'Commesse', route: '/app/projects/archives' },
        { id: 'tickets-direct', icon: 'fas fa-ticket-alt', label: 'Ticket', route: '/app/tickets/management' },
        { id: 'timecards-direct', icon: 'fas fa-clock', label: 'Timbrature', route: '/app/timecards' },
        { id: 'leaves-direct', icon: 'fas fa-calendar-plus', label: 'Ferie', route: '/app/leaves/request' }
      );
    }
    
    return intelligentItems;
  }
}