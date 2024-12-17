import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private baseUrl = 'http://localhost:5000/api/expenses'; // Adjust baseUrl according to your backend

  constructor(private http: HttpClient) {}

  // Add a new expense
  addExpense(
    userId: string,
    category: string,
    description: string,
    amount: number,
    date: string,
    isRecurring: boolean
  ): Observable<any> {
    const expenseData = { userId, category, description, amount, date, isRecurring };
    return this.http.post(`${this.baseUrl}/add`, expenseData);
  }

  // Get all expenses for a user
  getExpenses(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}`);
  }

  // Edit an existing expense
  editExpense(
    expenseId: string,
    category: string,
    description: string,
    amount: number,
    date: string,
    isRecurring: boolean
  ): Observable<any> {
    const updatedExpense = { category, description, amount, date, isRecurring };
    return this.http.put(`${this.baseUrl}/${expenseId}`, updatedExpense);
  }

  // Delete an expense
  deleteExpense(expenseId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${expenseId}`);
  }

  // Get user ID dynamically
  getUserId(): Observable<string> {
    const userId = localStorage.getItem('userId'); // Replace with API call if necessary
    if (userId) {
      return of(userId); // Wrap in Observable
    } else {
      throw new Error('User ID not found'); // Handle error if user ID is missing
    }
  }
}