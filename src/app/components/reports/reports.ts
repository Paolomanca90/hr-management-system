import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  imports: [
    CommonModule
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