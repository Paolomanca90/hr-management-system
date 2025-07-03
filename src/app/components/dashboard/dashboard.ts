import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

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
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  
  dashboardCards: DashboardCard[] = [
    {
      title: 'Dipendenti Totali',
      value: 245,
      icon: 'people',
      color: '#3498db',
      subtitle: '+5 questo mese'
    },
    {
      title: 'Presenze Oggi',
      value: 189,
      icon: 'event_available',
      color: '#2ecc71',
      subtitle: '77% presenza'
    },
    {
      title: 'Ferie Pendenti',
      value: 23,
      icon: 'beach_access',
      color: '#f39c12',
      subtitle: 'Da approvare'
    },
    {
      title: 'Budget Mensile',
      value: 125000,
      icon: 'account_balance_wallet',
      color: '#e74c3c',
      subtitle: 'Buste paga'
    }
  ];

  recentActivities = [
    { action: 'Nuovo dipendente aggiunto', user: 'Mario Rossi', time: '10 minuti fa' },
    { action: 'Ferie approvate', user: 'Giulia Bianchi', time: '1 ora fa' },
    { action: 'Busta paga generata', user: 'Luca Verdi', time: '2 ore fa' },
    { action: 'Contratto rinnovato', user: 'Sara Neri', time: '5 ore fa' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Inizializzazione componente
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  }
}
