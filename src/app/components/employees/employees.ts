import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService, Employee } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-employees',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './employees.html',
  styleUrl: './employees.scss'
})
export class Employees implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  departments: string[] = [];
  
  searchTerm: string = '';
  selectedDepartment: string = '';
  selectedStatus: string = '';
  
  loading = true;
  isCompanyUser = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isCompanyUser = this.authService.isCompanyUser();
    this.loadEmployees();
    this.loadDepartments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEmployees(): void {
    this.loading = true;
    
    this.dataService.getEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employees) => {
          this.employees = employees;
          this.filteredEmployees = [...employees];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading employees:', error);
          this.loading = false;
        }
      });
  }

  private loadDepartments(): void {
    this.dataService.getDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (departments) => {
          this.departments = departments;
        },
        error: (error) => {
          console.error('Error loading departments:', error);
        }
      });
  }

  applyFilters(): void {
    this.filteredEmployees = this.employees.filter(employee => {
      const matchesSearch = !this.searchTerm || 
        employee.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesDepartment = !this.selectedDepartment || 
        employee.department === this.selectedDepartment;
      
      const matchesStatus = !this.selectedStatus || 
        employee.status === this.selectedStatus;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.selectedStatus = '';
    this.filteredEmployees = [...this.employees];
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'badge-success';
      case 'inactive': return 'badge-error';
      case 'on-leave': return 'badge-warning';
      default: return 'badge-neutral';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Attivo';
      case 'inactive': return 'Inattivo';
      case 'on-leave': return 'In Ferie';
      default: return status;
    }
  }

  editEmployee(employee: Employee): void {
    if (!this.isCompanyUser) {
      alert('Operazione non permessa');
      return;
    }
    console.log('Modifica dipendente:', employee);
    // Implementare modal di modifica
  }

  viewEmployee(employee: Employee): void {
    console.log('Visualizza dipendente:', employee);
    // Implementare modal di visualizzazione
  }

  deleteEmployee(employee: Employee): void {
    if (!this.isCompanyUser) {
      alert('Operazione non permessa');
      return;
    }
    
    if (confirm(`Sei sicuro di voler eliminare ${employee.firstName} ${employee.lastName}?`)) {
      this.dataService.deleteEmployee(employee.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (success) => {
            if (success) {
              this.loadEmployees();
            } else {
              alert('Errore durante l\'eliminazione');
            }
          },
          error: (error) => {
            console.error('Error deleting employee:', error);
            alert('Errore durante l\'eliminazione');
          }
        });
    }
  }

  addNewEmployee(): void {
    if (!this.isCompanyUser) {
      alert('Operazione non permessa');
      return;
    }
    console.log('Aggiungi nuovo dipendente');
    // Implementare modal di aggiunta
  }

  refreshEmployees(): void {
    this.loadEmployees();
  }

  sendMessage(employee: Employee): void {
    console.log('Invia messaggio a:', employee);
    // Implementare sistema di messaggistica
  }

  viewProfile(employee: Employee): void {
    console.log('Visualizza profilo di:', employee);
    // Implementare visualizzazione profilo
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  }

  canEditEmployees(): boolean {
    return this.isCompanyUser && this.authService.hasPermission('employee_management');
  }

  canViewSalary(): boolean {
    return this.isCompanyUser && this.authService.hasPermission('salary_view');
  }
}