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
    const basicAuth =
      'Basic ' +
      this.fromHex(
        '63484a68626d46764c584d7a6147397a63476c30595777365a5864765a306c44536e645a574535365a4449356556704453545a4a5130703157564e434d474648526e564a52314a6f5355643462474a35516d745a5745316f53564e4a53325a52627a303d'
      );
    const headers = new HttpHeaders({
      Authorization: basicAuth,
    });
    this.loading = true;
    this.http
      .post<Blob>(
        'https://google-form-backend-yogp.onrender.com/api/getFeedbackResponse',
        payload,
        { headers, withCredentials: true, responseType: 'blob' as 'json' }
      )
      .pipe()
      .subscribe({
        next: (blob: Blob) => {
          this.loading = false;

          // Create a downloadable link
          const file = new Blob([blob], { type: 'application/octet-stream' }); // adjust MIME type if known
          const url = window.URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'feedback-report.xlsx'; // Change file name/type as needed
          a.click();
          window.URL.revokeObjectURL(url);

          alert('Download Successful!');
        },
        error: (err) => {
          this.loading = false;
          alert(`Error: ${err.message}`);
        },
      });
  }

  fromHex(hex: string) {
    const pairs = hex.match(/.{1,2}/g) || [];
    return pairs
      .map((byte) => String.fromCharCode(parseInt(byte, 16)))
      .join('');
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
