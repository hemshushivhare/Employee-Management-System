// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080';
  private isLoggedInVar = false;  // Variable to track login status

  constructor(private httpClient: HttpClient) {
    // Retrieve login status from localStorage on service initialization
    this.isLoggedInVar = localStorage.getItem('isLoggedIn') === 'true';
  }

  login(userData: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/login`, userData);
  }

  // Set the login status and store it in localStorage
  setLoggedIn(value: boolean): void {
    this.isLoggedInVar = value;
    localStorage.setItem('isLoggedIn', value.toString());
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return this.isLoggedInVar;
  }

  // Get the username from localStorage
  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  // Set the username in localStorage
  setUsername(username: string): void {
    localStorage.setItem('username', username);
  }
}
