import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  hireDate: Date;
  salary: number;
  status: 'active' | 'inactive' | 'on-leave';
}

export interface PayrollEntry {
  id: number;
  employeeId: number;
  employee: Employee;
  period: string;
  grossAmount: number;
  netAmount: number;
  status: 'processed' | 'processing' | 'error';
  processedDate?: Date;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  pendingLeaves: number;
  monthlyBudget: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private employees: Employee[] = [
    {
      id: 1,
      firstName: 'Mario',
      lastName: 'Rossi',
      email: 'mario.rossi@company.com',
      position: 'Sviluppatore Senior',
      department: 'IT',
      hireDate: new Date('2020-03-15'),
      salary: 45000,
      status: 'active'
    },
    {
      id: 2,
      firstName: 'Giulia',
      lastName: 'Bianchi',
      email: 'giulia.bianchi@company.com',
      position: 'Marketing Manager',
      department: 'Marketing',
      hireDate: new Date('2019-07-20'),
      salary: 42000,
      status: 'active'
    },
    {
      id: 3,
      firstName: 'Luca',
      lastName: 'Verdi',
      email: 'luca.verdi@company.com',
      position: 'Contabile',
      department: 'Amministrazione',
      hireDate: new Date('2021-01-10'),
      salary: 35000,
      status: 'on-leave'
    },
    {
      id: 4,
      firstName: 'Sara',
      lastName: 'Neri',
      email: 'sara.neri@company.com',
      position: 'HR Specialist',
      department: 'Risorse Umane',
      hireDate: new Date('2018-11-05'),
      salary: 38000,
      status: 'active'
    },
    {
      id: 5,
      firstName: 'Alessandro',
      lastName: 'Blu',
      email: 'alessandro.blu@company.com',
      position: 'Grafico',
      department: 'Design',
      hireDate: new Date('2022-09-12'),
      salary: 32000,
      status: 'active'
    },
    {
      id: 6,
      firstName: 'Francesca',
      lastName: 'Gialli',
      email: 'francesca.gialli@company.com',
      position: 'Project Manager',
      department: 'IT',
      hireDate: new Date('2020-05-03'),
      salary: 48000,
      status: 'inactive'
    }
  ];

  private payrollEntries: PayrollEntry[] = [
    {
      id: 1,
      employeeId: 1,
      employee: this.employees[0],
      period: 'Gennaio 2025',
      grossAmount: 3750,
      netAmount: 2890,
      status: 'processed',
      processedDate: new Date('2025-01-31')
    },
    {
      id: 2,
      employeeId: 2,
      employee: this.employees[1],
      period: 'Gennaio 2025',
      grossAmount: 3500,
      netAmount: 2720,
      status: 'processing'
    },
    {
      id: 3,
      employeeId: 3,
      employee: this.employees[2],
      period: 'Gennaio 2025',
      grossAmount: 2917,
      netAmount: 0,
      status: 'error',
      processedDate: new Date('2025-01-30')
    }
  ];

  // Simulazione di storage JSON locale
  private storageKey = 'hr-management-data';

  constructor() {
    this.loadFromStorage();
  }

  // Employees CRUD
  getEmployees(): Observable<Employee[]> {
    return of([...this.employees]).pipe(delay(300));
  }

  getEmployee(id: number): Observable<Employee | undefined> {
    return of(this.employees.find(emp => emp.id === id)).pipe(delay(300));
  }

  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    const newEmployee: Employee = {
      ...employee,
      id: Math.max(...this.employees.map(e => e.id)) + 1
    };
    this.employees.push(newEmployee);
    this.saveToStorage();
    return of(newEmployee).pipe(delay(300));
  }

  updateEmployee(id: number, employee: Partial<Employee>): Observable<Employee | null> {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...employee };
      this.saveToStorage();
      return of(this.employees[index]).pipe(delay(300));
    }
    return of(null).pipe(delay(300));
  }

  deleteEmployee(id: number): Observable<boolean> {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.employees.splice(index, 1);
      this.saveToStorage();
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  // Payroll CRUD
  getPayrollEntries(): Observable<PayrollEntry[]> {
    return of([...this.payrollEntries]).pipe(delay(300));
  }

  getPayrollEntry(id: number): Observable<PayrollEntry | undefined> {
    return of(this.payrollEntries.find(entry => entry.id === id)).pipe(delay(300));
  }

  // Dashboard Stats
  getDashboardStats(): Observable<DashboardStats> {
    const stats: DashboardStats = {
      totalEmployees: this.employees.length,
      presentToday: this.employees.filter(emp => emp.status === 'active').length,
      pendingLeaves: this.employees.filter(emp => emp.status === 'on-leave').length,
      monthlyBudget: this.employees.reduce((total, emp) => total + emp.salary, 0)
    };
    return of(stats).pipe(delay(300));
  }

  // Departments
  getDepartments(): Observable<string[]> {
    const departments = [...new Set(this.employees.map(emp => emp.department))];
    return of(departments).pipe(delay(300));
  }

  // Storage methods
  private loadFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.employees) {
            this.employees = parsed.employees.map((emp: any) => ({
              ...emp,
              hireDate: new Date(emp.hireDate)
            }));
          }
          if (parsed.payrollEntries) {
            this.payrollEntries = parsed.payrollEntries.map((entry: any) => ({
              ...entry,
              processedDate: entry.processedDate ? new Date(entry.processedDate) : undefined
            }));
          }
        } catch (error) {
          console.error('Error loading data from storage:', error);
        }
      }
    }
  }

  private saveToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const data = {
        employees: this.employees,
        payrollEntries: this.payrollEntries,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  }

  // Reset data
  resetData(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
    // Reload initial data
    this.loadFromStorage();
  }
}