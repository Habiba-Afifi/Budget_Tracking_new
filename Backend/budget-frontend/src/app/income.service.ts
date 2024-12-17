import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private baseUrl = 'http://localhost:5000/api/income'; // Adjust baseUrl according to your backend

  constructor(private http: HttpClient) {}

  // Add new income source
  addIncome(userId: string, sourceName: string, amount: number): Observable<any> {
    const incomeData = { userId, sourceName, amount };
    return this.http.post(`${this.baseUrl}/add`, incomeData);
  }

  // Get all income sources for a user
  getIncome(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}`);
  }

  // Edit an income source
  editIncome(incomeId: string, sourceName: string, amount: number): Observable<any> {
    const incomeData = { sourceName, amount };
    return this.http.put(`${this.baseUrl}/${incomeId}/edit`, incomeData);
  }
  deleteIncome(incomeId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${incomeId}`);
  }
  
  
}