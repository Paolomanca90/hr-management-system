import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
export class Dashboard implements OnInit {
  
  dashboardCards: DashboardCard[] = [
    {
      title: 'Dipendenti Totali',
      value: 245,
      icon: 'fas fa-users',
      color: 'bg-blue-500',
      subtitle: '+5 questo mese'
    },
    {
      title: 'Presenze Oggi',
      value: 189,
      icon: 'fas fa-calendar-check',
      color: 'bg-green-500',
      subtitle: '77% presenza'
    },
    {
      title: 'Ferie Pendenti',
      value: 23,
      icon: 'fas fa-umbrella-beach',
      color: 'bg-yellow-500',
      subtitle: 'Da approvare'
    },
    {
      title: 'Budget Mensile',
      value: 125000,
      icon: 'fas fa-euro-sign',
      color: 'bg-red-500',
      subtitle: 'Buste paga'
    }
  ];

  recentActivities = [
    { action: 'Nuovo dipendente aggiunto', user: 'Mario Rossi', time: '10 minuti fa' },
    { action: 'Ferie approvate', user: 'Giulia Bianchi', time: '1 ora fa' },
    { action: 'Busta paga generata', user: 'Luca Verdi', time: '2 ore fa' },
    { action: 'Contratto rinnovato', user: 'Sara Neri', time: '5 ore fa' },
    { action: 'Nuovo colloquio programmato', user: 'Marco Blu', time: '6 ore fa' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadDashboardData();
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

  private loadDashboardData(): void {
    // Simulazione caricamento dati
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }
}