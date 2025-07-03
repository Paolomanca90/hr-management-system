import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'hr-app-theme';
  private currentThemeSubject = new BehaviorSubject<Theme>('auto');
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    this.initializeTheme();
    this.setupMediaQueryListener();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    const theme = savedTheme || 'auto';
    this.setTheme(theme);
  }

  private setupMediaQueryListener(): void {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (this.currentThemeSubject.value === 'auto') {
          this.applyTheme();
        }
      });
    }
  }

  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme();
  }

  toggleTheme(): void {
    const currentTheme = this.currentThemeSubject.value;
    let newTheme: Theme;

    switch (currentTheme) {
      case 'light':
        newTheme = 'dark';
        break;
      case 'dark':
        newTheme = 'auto';
        break;
      case 'auto':
      default:
        newTheme = 'light';
        break;
    }

    this.setTheme(newTheme);
  }

  private applyTheme(): void {
    if (typeof document === 'undefined') return;

    const theme = this.currentThemeSubject.value;
    const isDark = this.shouldUseDarkMode(theme);
    
    // Applica il tema DaisyUI
    const daisyTheme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', daisyTheme);
    
    // Applica la classe dark per Tailwind CSS
    document.documentElement.classList.toggle('dark', isDark);
    
    // Aggiorna il color-scheme per migliorare l'accessibilità
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }

  private shouldUseDarkMode(theme: Theme): boolean {
    switch (theme) {
      case 'dark':
        return true;
      case 'light':
        return false;
      case 'auto':
      default:
        return typeof window !== 'undefined' 
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
          : false;
    }
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  isDarkMode(): boolean {
    return this.shouldUseDarkMode(this.currentThemeSubject.value);
  }

  // Utility methods per componenti
  getThemeIcon(): string {
    const theme = this.currentThemeSubject.value;
    switch (theme) {
      case 'light':
        return 'fas fa-sun';
      case 'dark':
        return 'fas fa-moon';
      case 'auto':
      default:
        return 'fas fa-adjust';
    }
  }

  getThemeLabel(): string {
    const theme = this.currentThemeSubject.value;
    switch (theme) {
      case 'light':
        return 'Modalità Chiara';
      case 'dark':
        return 'Modalità Scura';
      case 'auto':
      default:
        return 'Automatica';
    }
  }

  // Metodi per animazioni tema
  animateThemeChange(): void {
    if (typeof document === 'undefined') return;

    document.documentElement.style.transition = 'color-scheme 0.3s ease, background-color 0.3s ease';
    
    setTimeout(() => {
      document.documentElement.style.transition = '';
    }, 300);
  }
}