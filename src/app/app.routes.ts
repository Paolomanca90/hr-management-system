import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { MainLayout } from './components/main-layout/main-layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Employees } from './components/employees/employees';
import { Payroll } from './components/payroll/payroll';
import { Reports } from './components/reports/reports';
import { Settings } from './components/settings/settings';
import { PlaceholderPage } from './components/placeholder-page/placeholder-page';
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
      
      // Routes principali
      { path: 'employees', component: Employees },
      { path: 'payroll', component: Payroll },
      { path: 'reports', component: Reports },
      { path: 'settings', component: Settings },
      
      // Routes per menu items aziendali - usando PlaceholderPage
      { path: 'attendance/archives', component: PlaceholderPage, data: { title: 'Archivi Presenze' } },
      { path: 'attendance/tables', component: PlaceholderPage, data: { title: 'Tabelle Presenze' } },
      { path: 'company/info', component: PlaceholderPage, data: { title: 'Anagrafica Azienda' } },
      { path: 'company/locations', component: PlaceholderPage, data: { title: 'Sedi' } },
      { path: 'company/branches', component: PlaceholderPage, data: { title: 'Filiali' } },
      { path: 'company/cost-centers', component: PlaceholderPage, data: { title: 'Centri di Costo' } },
      { path: 'company/departments', component: PlaceholderPage, data: { title: 'Reparti' } },
      { path: 'company/inail', component: PlaceholderPage, data: { title: 'Posizioni Inail' } },
      { path: 'company/insurance', component: PlaceholderPage, data: { title: 'Posizioni Assicurative' } },
      { path: 'company/recalculation', component: PlaceholderPage, data: { title: 'Ricalcolo' } },
      { path: 'company/compensations', component: PlaceholderPage, data: { title: 'Compensazioni' } },
      { path: 'company/overtime', component: PlaceholderPage, data: { title: 'Straordinari' } },
      { path: 'company/allowances', component: PlaceholderPage, data: { title: 'Spettanze' } },
      { path: 'company/field-transfer', component: PlaceholderPage, data: { title: 'Spostamento Campi' } },
      
      { path: 'employees/absences', component: PlaceholderPage, data: { title: 'Programmazione Assenze' } },
      { path: 'employees/schedules', component: PlaceholderPage, data: { title: 'Sequenza Profili Orari' } },
      { path: 'employees/sick-leave', component: PlaceholderPage, data: { title: 'Pratiche di Malattia' } },
      { path: 'employees/accumulation', component: PlaceholderPage, data: { title: 'Campi Accumulo' } },
      
      { path: 'exports/statistics', component: PlaceholderPage, data: { title: 'Dati Statistici' } },
      { path: 'exports/tables', component: PlaceholderPage, data: { title: 'Esportazione Tabelle' } },
      { path: 'exports/hr-data', component: PlaceholderPage, data: { title: 'Dati HR' } },
      { path: 'exports/pass-manager', component: PlaceholderPage, data: { title: 'Pass Manager' } },
      { path: 'exports/privacy-log', component: PlaceholderPage, data: { title: 'Log Privacy' } },
      
      { path: 'imports/inaz-data', component: PlaceholderPage, data: { title: 'Dati Inaz' } },
      { path: 'imports/tables', component: PlaceholderPage, data: { title: 'Importazione Tabelle' } },
      { path: 'imports/hr-data', component: PlaceholderPage, data: { title: 'Importazione Dati HR' } },
      
      { path: 'processing', component: PlaceholderPage, data: { title: 'Elaborazioni' } },
      
      { path: 'functions/justifications', component: PlaceholderPage, data: { title: 'Gestione Giustificativi' } },
      { path: 'functions/edit-timestamps', component: PlaceholderPage, data: { title: 'Modifica Timbrature' } },
      { path: 'functions/schedule-change', component: PlaceholderPage, data: { title: 'Cambio Orario' } },
      
      { path: 'prints/various', component: PlaceholderPage, data: { title: 'Stampe Varie' } },
      { path: 'statistics', component: PlaceholderPage, data: { title: 'Statistiche' } },
      
      { path: 'utilities/change-password', component: PlaceholderPage, data: { title: 'Modifica Password' } },
      { path: 'utilities/email-settings', component: PlaceholderPage, data: { title: 'Impostazioni Email' } },
      
      { path: 'config/working-hours', component: PlaceholderPage, data: { title: 'Monte Ore' } },
      { path: 'config/schedule-profile', component: PlaceholderPage, data: { title: 'Cambio Profilo Orario' } },
      { path: 'config/overtime-authorization', component: PlaceholderPage, data: { title: 'Autorizzazione Straordinari' } },
      { path: 'config/overtime-initialization', component: PlaceholderPage, data: { title: 'Inizializzazione Straordinari' } },
      
      // Routes per menu dipendente/utente
      { path: 'canteen/tables', component: PlaceholderPage, data: { title: 'Tabelle Mensa' } },
      { path: 'canteen/processing', component: PlaceholderPage, data: { title: 'Elaborazioni Mensa' } },
      { path: 'canteen/prints', component: PlaceholderPage, data: { title: 'Stampe Mensa' } },
      
      { path: 'projects/archives', component: PlaceholderPage, data: { title: 'Archivi Commesse' } },
      { path: 'projects/processing', component: PlaceholderPage, data: { title: 'Elaborazioni Commesse' } },
      { path: 'projects/utilities', component: PlaceholderPage, data: { title: 'Utilità Commesse' } },
      
      { path: 'tickets/company', component: PlaceholderPage, data: { title: 'Anagrafica Azienda Ticket' } },
      { path: 'tickets/calculation', component: PlaceholderPage, data: { title: 'Calcolo Ticket' } },
      { path: 'tickets/management', component: PlaceholderPage, data: { title: 'Gestione Ticket' } },
      { path: 'tickets/print', component: PlaceholderPage, data: { title: 'Stampa Ticket' } },
      { path: 'tickets/file-creation', component: PlaceholderPage, data: { title: 'Creazione File Ticket' } },
      
      { path: 'options/sealed-air', component: PlaceholderPage, data: { title: 'Sealed Air' } },
      { path: 'options/extra-canteen', component: PlaceholderPage, data: { title: 'ExtraMensa' } },
      { path: 'options/self-web', component: PlaceholderPage, data: { title: 'SelfWeb' } },
      { path: 'options/rio-web', component: PlaceholderPage, data: { title: 'Rioweb' } },
      { path: 'options/smafin', component: PlaceholderPage, data: { title: 'Smafin' } },
      { path: 'options/nuovi2190', component: PlaceholderPage, data: { title: 'Nuovi2190' } },
      { path: 'options/fre', component: PlaceholderPage, data: { title: 'Fre' } },
      { path: 'options/prints', component: PlaceholderPage, data: { title: 'Stampe Opzioni' } },
      
      // Routes aggiuntive per azioni rapide
      { path: 'leaves/request', component: PlaceholderPage, data: { title: 'Richiesta Ferie' } },
      { path: 'timecards', component: PlaceholderPage, data: { title: 'Le Mie Timbrature' } },
      { path: 'payslip', component: PlaceholderPage, data: { title: 'La Mia Busta Paga' } },
      { path: 'canteen', component: PlaceholderPage, data: { title: 'Gestione Ticket Mensa' } }
    ]
  },
  { path: '**', redirectTo: '/login' }
];