import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
//from mail_config import conf;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/auth'; // Your FastAPI URL

  constructor(private http: HttpClient) {}

  // Signup method
  signup(newUser : any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, newUser ).pipe(
      catchError((error) => {
        console.error('Signup error:', error);
        return throwError(error); // Re-throw the error for further handling in the component
      })
    );
  }

  // Login method
  login(credentials: any): Observable<any> {
    console.log('Logging in with:', credentials.email, credentials.password);
    return this.http.post(`${this.apiUrl}/login`, {
      email: credentials.email,
      password: credentials.password
    }).pipe(
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(error);
      })
    );
  }
  
  

  // Optional: Method to get the authentication token from localStorage (if needed)
  getAuthToken(): string | null {
    return localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
  }

  // Optional: Method to store the authentication token in localStorage (if needed)
  storeAuthToken(token: string): void {
    localStorage.setItem('authToken', token); // Store the token for future use
  }

  // Optional: Method to clear the authentication token (logout)
  clearAuthToken(): void {
    localStorage.removeItem('authToken'); // Remove the token when the user logs out
  }

  // Method to include the authentication token in HTTP headers (if needed)
  private getHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  // Example method to make a request with an Authorization token
  protected makeAuthenticatedRequest(url: string, data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(url, data, { headers }).pipe(
      catchError((error) => {
        console.error('Request error:', error);
        return throwError(error);
      })
    );
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      new_password: newPassword
    });
  }
  
}

