import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  
  companySettings = {
    name: 'HR Company Srl',
    fiscalCode: '12345678901',
    address: 'Via Roma 123, Milano',
    email: 'info@hrcompany.com',
    phone: '+39 02 1234567'
  };
  
  workSettings = {
    dailyHours: 8,
    weeklyDays: 5,
    startTime: '09:00',
    endTime: '18:00'
  };
  
  leaveSettings = {
    autoApproval: false,
    annualDays: 22
  };
  
  saveSettings(): void {
    console.log('Saving settings...');
  }
  
  resetSettings(): void {
    console.log('Resetting settings...');
  }
}