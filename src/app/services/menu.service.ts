// src/app/services/menu.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService, User } from './auth.service';

export interface MenuItem {
  id: string;
  icon: string;
  label: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
  disabled?: boolean;
  badge?: string | number;
}

export type UserRole = 'admin' | 'company' | 'user' | 'employee';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  
  // Menu per ruolo azienda/admin
  private companyMenu: MenuItem[] = [
    {
      id: 'dashboard',
      icon: 'fas fa-tachometer-alt',
      label: 'Dashboard',
      route: '/app/dashboard'
    },
    {
      id: 'rilevazione-presenze',
      icon: 'fas fa-clock',
      label: 'Rilevazione Presenze',
      expanded: false,
      children: [
        { 
          id: 'archivi', 
          icon: 'fas fa-archive', 
          label: 'Archivi', 
          route: '/app/attendance/archives',
          expanded: false,
          children: [
            { id: 'tabelle', icon: 'fas fa-table', label: 'Tabelle', route: '/app/attendance/tables' },
            {
              id: 'azienda',
              icon: 'fas fa-building',
              label: 'Azienda',
              expanded: false,
              children: [
                { id: 'anagrafica-azienda', icon: 'fas fa-info-circle', label: 'Anagrafica Azienda', route: '/app/company/info' },
                { id: 'sedi', icon: 'fas fa-map-marker-alt', label: 'Sedi', route: '/app/company/locations' },
                { id: 'filiali', icon: 'fas fa-building', label: 'Filiali', route: '/app/company/branches' },
                { id: 'centri-costo', icon: 'fas fa-euro-sign', label: 'Centri di Costo', route: '/app/company/cost-centers' },
                { id: 'reparti', icon: 'fas fa-sitemap', label: 'Reparti', route: '/app/company/departments' },
                { id: 'posizioni-inail', icon: 'fas fa-hard-hat', label: 'Posizioni Inail', route: '/app/company/inail' },
                { id: 'posizioni-assicurative', icon: 'fas fa-shield-alt', label: 'Posizioni Assicurative Terri', route: '/app/company/insurance' },
                { id: 'ricalcolo', icon: 'fas fa-calculator', label: 'Ricalcolo', route: '/app/company/recalculation' },
                { id: 'compensazioni', icon: 'fas fa-balance-scale', label: 'Compensazioni', route: '/app/company/compensations' },
                { id: 'straordinari', icon: 'fas fa-clock', label: 'Straordinari', route: '/app/company/overtime' },
                { id: 'spettanze', icon: 'fas fa-money-bill', label: 'Spettanze', route: '/app/company/allowances' },
                { id: 'spostamento-campi', icon: 'fas fa-exchange-alt', label: 'Spostamento Campi Accur', route: '/app/company/field-transfer' }
              ]
            },
            {
              id: 'dipendente',
              icon: 'fas fa-users',
              label: 'Dipendente',
              expanded: false,
              children: [
                { id: 'anagrafica-dipendente', icon: 'fas fa-user', label: 'Anagrafica Dipendente', route: '/app/employees' },
                { id: 'programmazione-assenze', icon: 'fas fa-calendar-times', label: 'Programmazione Assenze', route: '/app/employees/absences' },
                { id: 'sequenza-profili', icon: 'fas fa-list', label: 'Sequenza Profili Orari', route: '/app/employees/schedules' },
                { id: 'pratiche-malattia', icon: 'fas fa-medkit', label: 'Pratiche di Malattia', route: '/app/employees/sick-leave' },
                { id: 'campi-accumulo', icon: 'fas fa-plus-circle', label: 'Campi Accumulo', route: '/app/employees/accumulation' }
              ]
            },
            {
              id: 'esportazioni',
              icon: 'fas fa-download',
              label: 'Esportazioni',
              expanded: false,
              children: [
                { id: 'dati-statistici', icon: 'fas fa-chart-bar', label: 'Dati Statistici', route: '/app/exports/statistics' },
                { id: 'tabelle-export', icon: 'fas fa-table', label: 'Tabelle', route: '/app/exports/tables' },
                { id: 'dati-hr', icon: 'fas fa-users', label: 'Dati Hr', route: '/app/exports/hr-data' },
                { id: 'pass-manager', icon: 'fas fa-key', label: 'Pass Manager', route: '/app/exports/pass-manager' },
                { id: 'log-privacy', icon: 'fas fa-shield-alt', label: 'Log Privacy', route: '/app/exports/privacy-log' }
              ]
            },
            {
              id: 'importazioni',
              icon: 'fas fa-upload',
              label: 'Importazioni',
              expanded: false,
              children: [
                { id: 'dati-inaz', icon: 'fas fa-file-import', label: 'Dati Inaz', route: '/app/imports/inaz-data' },
                { id: 'tabelle-import', icon: 'fas fa-table', label: 'Tabelle', route: '/app/imports/tables' },
                { id: 'dati-hr-import', icon: 'fas fa-users', label: 'Dati Hr', route: '/app/imports/hr-data' }
              ]
            },
          ]
        },
        {
          id: 'elaborazioni',
          icon: 'fas fa-cogs',
          label: 'Elaborazioni',
          route: '/app/processing',
          expanded: false,
          children: [
            {
              id: 'funzioni',
              icon: 'fas fa-tools',
              label: 'Funzioni',
              expanded: false,
              children: [
                { id: 'gestione-giustificativi', icon: 'fas fa-file-alt', label: 'Gestione Giustificativi', route: '/app/functions/justifications' },
                { id: 'modifica-timbrature', icon: 'fas fa-edit', label: 'Modifica Timbrature', route: '/app/functions/edit-timestamps' },
                { id: 'cambio-orario', icon: 'fas fa-clock', label: 'Cambio Orario', route: '/app/functions/schedule-change' }
              ]
            },
            {
              id: 'stampe',
              icon: 'fas fa-print',
              label: 'Stampe',
              expanded: false,
              children: [
                { id: 'stampe-varie', icon: 'fas fa-file-alt', label: 'Stampe Varie', route: '/app/prints/various' }
              ]
            },
            {
              id: 'statistiche',
              icon: 'fas fa-chart-line',
              label: 'Statistiche',
              route: '/app/statistics'
            },
          ]
        },
        {
          id: 'utilita',
          icon: 'fas fa-wrench',
          label: 'Utilità',
          expanded: false,
          children: [
            { id: 'modifica-password', icon: 'fas fa-key', label: 'Modifica Password', route: '/app/utilities/change-password' },
            { id: 'indirizzo-email', icon: 'fas fa-envelope', label: 'Indirizzo e-mail', route: '/app/utilities/email-settings' },
            { id: 'configurazione', icon: 'fas fa-cog', label: 'Configurazione' , route: '/app/utilities/configuration' },
            { id: 'monte-ore', icon: 'fas fa-clock', label: 'Monte Ore', route: '/app/utilities/working-hours' },
            { id: 'cambio-profilo', icon: 'fas fa-user-cog', label: 'Cambio Profilo Orario', route: '/app/utilities/schedule-profile' },
            { id: 'autorizzazione-straordinari', icon: 'fas fa-check-circle', label: 'Autorizzazione Straordinari', route: '/app/utilities/overtime-authorization' },
            { id: 'inizializzazione', icon: 'fas fa-play-circle', label: 'Inizializzazione Straordinari Orari', route: '/app/utilities/overtime-initialization' }
          ]
        },
      ]
    },
    {
      id: 'gestione-mensa',
      icon: 'fas fa-utensils',
      label: 'Gestione Mensa',
      expanded: false,
      children: [
        { id: 'tabelle-mensa', icon: 'fas fa-table', label: 'Tabelle', route: '/app/canteen/tables' },
        { id: 'elaborazioni-mensa', icon: 'fas fa-cogs', label: 'Elaborazioni', route: '/app/canteen/processing' },
        { id: 'stampe-mensa', icon: 'fas fa-print', label: 'Stampe', route: '/app/canteen/prints' }
      ]
    },
    {
      id: 'gestione-commesse',
      icon: 'fas fa-briefcase',
      label: 'Gestione Commesse',
      expanded: false,
      children: [
        { id: 'archivi-commesse', icon: 'fas fa-archive', label: 'Archivi', route: '/app/projects/archives' },
        { id: 'elaborazioni-commesse', icon: 'fas fa-cogs', label: 'Elaborazioni', route: '/app/projects/processing' },
        { id: 'utilita-commesse', icon: 'fas fa-wrench', label: 'Utilità', route: '/app/projects/utilities' }
      ]
    },
    {
      id: 'gestione-ticket',
      icon: 'fas fa-ticket-alt',
      label: 'Gestione Ticket',
      expanded: false,
      children: [
        { id: 'anagrafica-azienda-ticket', icon: 'fas fa-building', label: 'Anagrafica Azienda', route: '/app/tickets/company' },
        { id: 'calcolo-ticket', icon: 'fas fa-calculator', label: 'Calcolo Ticket', route: '/app/tickets/calculation' },
        { id: 'gestione-ticket-main', icon: 'fas fa-ticket-alt', label: 'Gestione Ticket', route: '/app/tickets/management' },
        { id: 'stampa-ticket', icon: 'fas fa-print', label: 'Stampa Ticket', route: '/app/tickets/print' },
        { id: 'creazione-file', icon: 'fas fa-file-plus', label: 'Creazione File Ticket', route: '/app/tickets/file-creation' }
      ]
    },
    {
      id: 'opzioni',
      icon: 'fas fa-cog',
      label: 'Opzioni',
      expanded: false,
      children: [
        { id: 'sealed-air', icon: 'fas fa-air-freshener', label: 'Sealed Air', route: '/app/options/sealed-air' },
        { id: 'extra-mensa', icon: 'fas fa-plus', label: 'ExtraMensa', route: '/app/options/extra-canteen' },
        { id: 'self-web', icon: 'fas fa-globe', label: 'SelfWeb', route: '/app/options/self-web' },
        { id: 'rio-web', icon: 'fas fa-water', label: 'Rioweb', route: '/app/options/rio-web' },
        { id: 'smafin', icon: 'fas fa-chart-line', label: 'Smafin', route: '/app/options/smafin' },
        { id: 'nuovi2190', icon: 'fas fa-file-alt', label: 'Nuovi2190', route: '/app/options/nuovi2190' },
        { id: 'fre', icon: 'fas fa-square', label: 'Fre', route: '/app/options/fre' },
        { id: 'stampe-opzioni', icon: 'fas fa-print', label: 'Stampe', route: '/app/options/prints' }
      ]
    }
  ];

  // Menu per utente dipendente
  private userMenu: MenuItem[] = [
    
  ];

  constructor(private authService: AuthService) {}

  getMenuItems(): Observable<MenuItem[]> {
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser) {
      return of([]);
    }

    // Determina il tipo di menu basato sul ruolo dell'utente
    const userRole = this.getUserRole(currentUser);
    
    let menuItems: MenuItem[];
    
    switch (userRole) {
      case 'company':
      case 'admin':
        menuItems = [...this.companyMenu];
        break;
      case 'user':
      case 'employee':
        menuItems = [...this.userMenu];
        break;
      default:
        menuItems = [...this.userMenu];
    }

    return of(menuItems);
  }

  toggleMenuItem(menuId: string): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const userRole = this.getUserRole(currentUser);
    const menuItems = userRole === 'company' || userRole === 'admin' 
      ? this.companyMenu 
      : this.userMenu;

    const menuItem = this.findMenuItemById(menuItems, menuId);
    if (menuItem && menuItem.children) {
      menuItem.expanded = !menuItem.expanded;
    }
  }

  private getUserRole(user: User): UserRole {
    // Logica per determinare il ruolo basato sui dati dell'utente
    // Puoi personalizzare questa logica secondo le tue necessità
    
    if (user.role === 'admin') {
      return 'admin';
    }
    
    // Se il dominio contiene 'company' o 'admin', è un utente aziendale
    if (user.domain.toLowerCase().includes('company') || 
        user.domain.toLowerCase().includes('admin') ||
        user.domain.toLowerCase().includes('azienda')) {
      return 'company';
    }
    
    return 'user';
  }

  private findMenuItemById(items: MenuItem[], id: string): MenuItem | null {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        const found = this.findMenuItemById(item.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  // Metodo per cercare un menu item e tutti i suoi genitori
  findMenuPath(targetId: string): string[] {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return [];

    const userRole = this.getUserRole(currentUser);
    const menuItems = userRole === 'company' || userRole === 'admin' 
      ? this.companyMenu 
      : this.userMenu;

    const path: string[] = [];
    this.findMenuPathRecursive(menuItems, targetId, path);
    return path;
  }

  private findMenuPathRecursive(items: MenuItem[], targetId: string, currentPath: string[]): boolean {
    for (const item of items) {
      currentPath.push(item.id);
      
      if (item.id === targetId) {
        return true;
      }
      
      if (item.children && this.findMenuPathRecursive(item.children, targetId, currentPath)) {
        return true;
      }
      
      currentPath.pop();
    }
    return false;
  }

  // Metodo per espandere automaticamente i genitori di un menu item
  expandToMenuItem(targetId: string): void {
    const path = this.findMenuPath(targetId);
    path.forEach(menuId => {
      const currentUser = this.authService.currentUserValue;
      if (!currentUser) return;

      const userRole = this.getUserRole(currentUser);
      const menuItems = userRole === 'company' || userRole === 'admin' 
        ? this.companyMenu 
        : this.userMenu;

      const menuItem = this.findMenuItemById(menuItems, menuId);
      if (menuItem && menuItem.children) {
        menuItem.expanded = true;
      }
    });
  }
}