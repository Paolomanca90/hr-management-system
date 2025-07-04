import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginCredentials {
  username: string;
  password: string;
  domain: string;
}

export interface User {
  id: string;
  username: string;
  domain: string;
  role: 'admin' | 'company' | 'user' | 'employee';
  company: string;
  permissions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Utenti demo per il mockup
  private demoUsers: { [key: string]: User } = {
    'admin.company': {
      id: '1',
      username: 'admin',
      domain: 'company',
      role: 'admin',
      company: 'Company Srl',
      permissions: ['all']
    },
    'manager.azienda': {
      id: '2',
      username: 'manager',
      domain: 'azienda',
      role: 'company',
      company: 'Azienda SpA',
      permissions: ['company_management', 'employee_management', 'reports']
    },
    'dipendente.user': {
      id: '3',
      username: 'dipendente',
      domain: 'user',
      role: 'user',
      company: 'User Company',
      permissions: ['self_service', 'canteen', 'tickets']
    },
    'employee.worker': {
      id: '4',
      username: 'employee',
      domain: 'worker',
      role: 'employee',
      company: 'Worker Corp',
      permissions: ['basic_access']
    }
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Controlla se c'è un utente salvato in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginCredentials): Observable<any> {
    // Simulazione di chiamata API con utenti demo
    return new Observable(observer => {
      setTimeout(() => {
        const userKey = `${credentials.username}.${credentials.domain}`;
        const user = this.demoUsers[userKey];

        if (user && credentials.password) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          observer.next({ success: true, user });
          observer.complete();
        } else {
          observer.error({ 
            message: 'Credenziali non valide. Prova: admin/company, manager/azienda, dipendente/user, employee/worker'
          });
        }
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserValue;
    if (!user || !user.permissions) return false;
    
    return user.permissions.includes('all') || user.permissions.includes(permission);
  }

  getUserRole(): 'admin' | 'company' | 'user' | 'employee' | null {
    const user = this.currentUserValue;
    return user ? user.role : null;
  }

  isCompanyUser(): boolean {
    const role = this.getUserRole();
    return role === 'admin' || role === 'company';
  }

  isRegularUser(): boolean {
    const role = this.getUserRole();
    return role === 'user' || role === 'employee';
  }
}