import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  title = 'google-form-response-app';
  selectedRange = 'all';
  showCustomDates = false;
  minDate = '2010-01-01';
  maxDate = new Date().toISOString().split('T')[0]; // Gets today's date in YYYY-MM-DD format
  fromDate: string = '';
  toDate: string = '';

  validateDates() {
    if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
      alert('From date cannot be greater than To date.');
      this.fromDate = ''; // Reset invalid value
      this.toDate = ''; // Reset invalid value
      return true;
    }
    return false;
  }

  submitDateRange() {
    this.http
      .post('https://jsonplaceholder.typicode.com/posts', {
        from: this.fromDate,
        to: this.toDate,
      })
      .pipe()
      .subscribe({
        next: (response) =>
          alert(`POST Successful!! Response: ${JSON.stringify(response)}`),
        error: (err) => alert(`Error: ${err.message}`),
      });
  }

  handleDateRangeChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedRange = selectedValue;
    this.showCustomDates = selectedValue === 'custom';
  }
}
