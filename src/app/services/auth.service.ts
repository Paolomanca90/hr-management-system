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
  role: string;
  company: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

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
    // Simulazione di chiamata API - sostituisci con la tua logica
    return new Observable(observer => {
      setTimeout(() => {
        if (credentials.username && credentials.password && credentials.domain) {
          const user: User = {
            id: '1',
            username: credentials.username,
            domain: credentials.domain,
            role: 'admin',
            company: `${credentials.domain} Company`
          };
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          observer.next({ success: true, user });
          observer.complete();
        } else {
          observer.error({ message: 'Credenziali non valide' });
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
}