import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private baseUrl = 'http://localhost:5000/api/goals'; // Update as needed

  constructor(private http: HttpClient) {}

  // Create a new goal
  createGoal(userId: string, goalData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, { userId, ...goalData });
  }


  // Get all goals for a user
  getGoalsByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}`);
  }
}