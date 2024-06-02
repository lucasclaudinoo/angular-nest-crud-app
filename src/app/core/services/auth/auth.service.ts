import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private authenticated = new BehaviorSubject<boolean>(false);
  private accessToken: string | null = null;
  private _refreshToken: string | null = null;

  constructor(private http: HttpClient) {
    this.loadTokens();
  }

  private loadTokens() {
    if (typeof localStorage !== 'undefined') {
      const storedAccessToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (storedAccessToken && storedRefreshToken) {
        this.accessToken = storedAccessToken;
        this._refreshToken = storedRefreshToken;
        this.authenticated.next(true);
      }
    }
  }

  private saveTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this._refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.authenticated.next(true);
  }

  login(credentials: { email: string; password: string }): Observable<{ accessToken: string, refreshToken: string }> {
    return this.http.post<{ accessToken: string, refreshToken: string }>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.saveTokens(response.accessToken, response.refreshToken);
        })
      );
  }

  refreshAccessToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/auth/refresh`, { refreshToken: this._refreshToken })
      .pipe(
        tap(response => {
          this.accessToken = response.accessToken;
          localStorage.setItem('accessToken', response.accessToken);
        })
      );
  }

  logout(): void {
    this.accessToken = null;
    this._refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.authenticated.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authenticated.asObservable();
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}
