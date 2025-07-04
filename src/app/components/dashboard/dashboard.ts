import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService, DashboardStats } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

export interface DashboardCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  subtitle?: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  dashboardCards: DashboardCard[] = [];
  recentActivities: any[] = [];
  stats: DashboardStats | null = null;
  loading = true;
  isCompanyUser = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isCompanyUser = this.authService.isCompanyUser();
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    this.loading = true;
    
    this.dataService.getDashboardStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
          this.updateDashboardCards(stats);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading dashboard data:', error);
          this.loading = false;
        }
      });

    this.recentActivities = [
      { action: 'Nuovo dipendente aggiunto', user: 'Mario Rossi', time: '10 minuti fa' },
      { action: 'Ferie approvate', user: 'Giulia Bianchi', time: '1 ora fa' },
      { action: 'Busta paga generata', user: 'Luca Verdi', time: '2 ore fa' },
      { action: 'Contratto rinnovato', user: 'Sara Neri', time: '5 ore fa' },
      { action: 'Nuovo colloquio programmato', user: 'Marco Blu', time: '6 ore fa' }
    ];
  }

  private updateDashboardCards(stats: DashboardStats): void {
    if (this.isCompanyUser) {
      // Dashboard per utenti aziendali
      this.dashboardCards = [
        {
          title: 'Dipendenti Totali',
          value: stats.totalEmployees,
          icon: 'fas fa-users',
          color: 'bg-blue-500',
          subtitle: '+5 questo mese'
        },
        {
          title: 'Presenze Oggi',
          value: stats.presentToday,
          icon: 'fas fa-calendar-check',
          color: 'bg-green-500',
          subtitle: `${Math.round((stats.presentToday / stats.totalEmployees) * 100)}% presenza`
        },
        {
          title: 'Ferie Pendenti',
          value: stats.pendingLeaves,
          icon: 'fas fa-umbrella-beach',
          color: 'bg-yellow-500',
          subtitle: 'Da approvare'
        },
        {
          title: 'Budget Mensile',
          value: stats.monthlyBudget,
          icon: 'fas fa-euro-sign',
          color: 'bg-red-500',
          subtitle: 'Buste paga'
        }
      ];
    } else {
      // Dashboard per dipendenti/utenti
      this.dashboardCards = [
        {
          title: 'Ore Lavorate',
          value: 160,
          icon: 'fas fa-clock',
          color: 'bg-blue-500',
          subtitle: 'Questo mese'
        },
        {
          title: 'Giorni Ferie',
          value: 18,
          icon: 'fas fa-umbrella-beach',
          color: 'bg-green-500',
          subtitle: 'Rimanenti'
        },
        {
          title: 'Straordinari',
          value: 12,
          icon: 'fas fa-plus-circle',
          color: 'bg-yellow-500',
          subtitle: 'Ore accumulate'
        },
        {
          title: 'Ticket Mensa',
          value: 45,
          icon: 'fas fa-utensils',
          color: 'bg-purple-500',
          subtitle: 'Disponibili'
        }
      ];
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  }

  getCurrentDateTime(): string {
    const now = new Date();
    return new Intl.DateTimeFormat('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(now);
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  getQuickActions(): { label: string; icon: string; route: string; color: string }[] {
    if (this.isCompanyUser) {
      return [
        { label: 'Nuovo Dipendente', icon: 'fas fa-user-plus', route: '/app/employees', color: 'btn-primary' },
        { label: 'Gestisci Ferie', icon: 'fas fa-calendar-alt', route: '/app/leaves', color: 'btn-primary' },
        { label: 'Genera Report', icon: 'fas fa-file-alt', route: '/app/reports', color: 'btn-primary' },
        { label: 'Buste Paga', icon: 'fas fa-money-check-alt', route: '/app/payroll', color: 'btn-primary' }
      ];
    } else {
      return [
        { label: 'Richiedi Ferie', icon: 'fas fa-calendar-plus', route: '/app/leaves/request', color: 'btn-primary' },
        { label: 'Timbrature', icon: 'fas fa-clock', route: '/app/timecards', color: 'btn-success' },
        { label: 'Busta Paga', icon: 'fas fa-file-invoice', route: '/app/payslip', color: 'btn-info' },
        { label: 'Ticket Mensa', icon: 'fas fa-utensils', route: '/app/canteen', color: 'btn-warning' }
      ];
    }
  }

  navigateToAction(route: string): void {
    console.log('Navigate to:', route);
  }
}