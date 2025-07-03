import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
export class Employees implements OnInit {
  
  employees: Employee[] = [
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

  filteredEmployees: Employee[] = [];
  searchTerm: string = '';
  selectedDepartment: string = '';
  selectedStatus: string = '';

  departments: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.filteredEmployees = [...this.employees];
    this.departments = [...new Set(this.employees.map(emp => emp.department))];
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
    console.log('Modifica dipendente:', employee);
  }

  viewEmployee(employee: Employee): void {
    console.log('Visualizza dipendente:', employee);
  }

  deleteEmployee(employee: Employee): void {
    if (confirm(`Sei sicuro di voler eliminare ${employee.firstName} ${employee.lastName}?`)) {
      this.employees = this.employees.filter(emp => emp.id !== employee.id);
      this.applyFilters();
    }
  }

  addNewEmployee(): void {
    console.log('Aggiungi nuovo dipendente');
  }

  refreshEmployees(): void {
    console.log('Aggiorna lista dipendenti');
    this.applyFilters();
  }

  sendMessage(employee: Employee): void {
    console.log('Invia messaggio a:', employee);
  }

  viewProfile(employee: Employee): void {
    console.log('Visualizza profilo di:', employee);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  }
}