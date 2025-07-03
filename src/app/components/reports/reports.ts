import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-reports',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class Reports {
  
  generateReport(type: string): void {
    console.log('Generating report:', type);
  }
  
  exportReport(format: string): void {
    console.log('Exporting report as:', format);
  }
}