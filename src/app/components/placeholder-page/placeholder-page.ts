// src/app/components/placeholder-page/placeholder-page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-placeholder-page',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './placeholder-page.html',
  styleUrl: './placeholder-page.scss'
})
export class PlaceholderPage implements OnInit {
  pageTitle: string = '';
  pageDescription: string = '';
  pageIcon: string = 'fas fa-cog';
  breadcrumbs: string[] = [];
  plannedFeatures: string[] = [];
  relatedActions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.pageTitle = data['title'] || 'Pagina in Sviluppo';
      this.setupPageContent();
    });
  }

  private setupPageContent(): void {
    const isCompanyUser = this.authService.isCompanyUser();
    
    switch (this.pageTitle) {
      case 'Archivi Presenze':
        this.pageIcon = 'fas fa-archive';
        this.pageDescription = 'Gestione archivi delle presenze dipendenti';
        this.breadcrumbs = ['Rilevazione Presenze'];
        this.plannedFeatures = [
          'Visualizzazione storico presenze',
          'Filtri avanzati per periodo e dipendente',
          'Esportazione dati in Excel',
          'Grafici di riepilogo'
        ];
        break;
        
      case 'Tabelle Mensa':
        this.pageIcon = 'fas fa-utensils';
        this.pageDescription = 'Configurazione tabelle per la gestione mensa';
        this.breadcrumbs = ['Gestione Mensa'];
        this.plannedFeatures = [
          'Gestione menu giornalieri',
          'Configurazione prezzi',
          'Gestione allergeni',
          'Prenotazioni pasti'
        ];
        break;
        
      case 'Gestione Ticket':
        this.pageIcon = 'fas fa-ticket-alt';
        this.pageDescription = 'Sistema di gestione ticket e buoni pasto';
        this.breadcrumbs = ['Gestione Ticket'];
        this.plannedFeatures = [
          'Emissione buoni pasto',
          'Tracciamento utilizzo',
          'Report mensili',
          'Integrazione con fornitori'
        ];
        break;
        
      default:
        this.pageIcon = 'fas fa-cog';
        this.pageDescription = 'Funzionalità in fase di sviluppo';
        this.plannedFeatures = [
          'Interfaccia utente intuitiva',
          'Funzionalità complete',
          'Integrazione con il sistema',
          'Report e statistiche'
        ];
        break;
    }

    this.setupRelatedActions(isCompanyUser);
  }

  private setupRelatedActions(isCompanyUser: boolean): void {
    if (isCompanyUser) {
      this.relatedActions = [
        {
          title: 'Gestione Dipendenti',
          description: 'Visualizza e gestisci i dipendenti',
          icon: 'fas fa-users',
          color: 'blue',
          route: '/app/employees',
          buttonText: 'Vai ai Dipendenti'
        },
        {
          title: 'Report',
          description: 'Genera report e statistiche',
          icon: 'fas fa-chart-bar',
          color: 'green',
          route: '/app/reports',
          buttonText: 'Vai ai Report'
        },
        {
          title: 'Impostazioni',
          description: 'Configura il sistema',
          icon: 'fas fa-cog',
          color: 'yellow',
          route: '/app/settings',
          buttonText: 'Vai alle Impostazioni'
        }
      ];
    } else {
      this.relatedActions = [
        {
          title: 'Le Mie Timbrature',
          description: 'Visualizza le tue presenze',
          icon: 'fas fa-clock',
          color: 'blue',
          route: '/app/timecards',
          buttonText: 'Vedi Timbrature'
        },
        {
          title: 'Richiesta Ferie',
          description: 'Richiedi giorni di ferie',
          icon: 'fas fa-calendar-plus',
          color: 'green',
          route: '/app/leaves/request',
          buttonText: 'Richiedi Ferie'
        }
      ];
    }
  }

  goBack(): void {
    window.history.back();
  }
}