import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';

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
  loading: boolean = false;

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
    if (this.showCustomDates && this.validateDates()) {
      return;
    }
    const payload = this.showCustomDates
      ? { fromDate: this.fromDate, toDate: this.toDate }
      : { selectValue: this.selectedRange };
    const username = environment.apiUsername;
    const password = environment.apiPassword;
    const basicAuth = 'Basic ' + btoa(username + ':' + password);
    const headers = new HttpHeaders({
      Authorization: basicAuth,
    });
    this.loading = true;
    this.http
      .post(
        'https://google-form-backend-yogp.onrender.com/api/getFeedbackResponse',
        payload,
        { headers, withCredentials: true }
      )
      .pipe()
      .subscribe({
        next: (response) => {
          this.loading = false;
          alert(`Download Successful!`);
        },
        error: (err) => {
          this.loading = false;
          alert(`Error: ${err.message}`);
        },
      });
  }

  handleDateRangeChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedRange = selectedValue;
    this.showCustomDates = selectedValue === 'custom date range';

    if (!this.showCustomDates) {
      this.fromDate = '';
      this.toDate = '';
    }
  }
}
