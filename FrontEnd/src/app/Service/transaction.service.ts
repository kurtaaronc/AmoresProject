import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ApiResponse {
  payments: any[]; // Adjust the type as needed
  loans: any[]; // Adjust the type as needed
  totalLoans: any[];
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private http: HttpClient) {}
  public options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  getAll(): Observable<string[]> {
    var apiUrl = 'http://localhost:3000/transactions';
    return this.http.get<string[]>(apiUrl);
  }

  getAllMonthlyDetails(): Observable<ApiResponse> {
    var apiUrl = 'http://localhost:3000/transactions/AllMonthly';
    return this.http.get<ApiResponse>(apiUrl);
  }

  getById(id: number): Observable<ApiResponse> {
    const apiUrl = `http://localhost:3000/transactions/${id}`;
    return this.http.get<ApiResponse>(apiUrl);
  }

  completeTransaction(id: any): Observable<any> {
    var apiUrl = `http://localhost:3000/transactions/completeTransaction`;
    return this.http.put<string[]>(apiUrl, id);
  }

  addNewTransaction(payload: any): Observable<any> {
    var apiUrl = `http://localhost:3000/transactions`;
    return this.http.post<boolean>(apiUrl, payload);
  }

  createPayment(payload: any): Observable<any> {
    var apiUrl = `http://localhost:3000/transactions/createPayment`;
    return this.http.put<boolean>(apiUrl, payload);
  }

  updateDateOfPayment(payload: any): Observable<any> {
    var apiUrl = `http://localhost:3000/transactions/updateDateOfPayment`;
    return this.http.put<boolean>(apiUrl, payload);
  }
}
