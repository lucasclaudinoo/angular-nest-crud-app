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
  private accessToken = new BehaviorSubject<string | null>(null);
  private refreshToken = new BehaviorSubject<string | null>(null);
  private user = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
  }



  private saveTokens(accessToken: string, refreshToken: string, user: any) {
    this.accessToken.next(accessToken);
    this.refreshToken.next(refreshToken);
    this.user.next(user);
    this.authenticated.next(true);
  }

  login(credentials: { email: string; password: string }): Observable<{ accessToken: string; refreshToken: string; user: any }> {
    return this.http.post<{ accessToken: string; refreshToken: string; user: any }>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.saveTokens(response.accessToken, response.refreshToken, response.user);
        })
      );
  }

  refreshAccessToken(): Observable<{ accessToken: string }> {
    const refreshTokenValue = this.refreshToken.getValue();
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/auth/refresh`, { refreshToken: refreshTokenValue })
      .pipe(
        tap(response => {
          this.accessToken.next(response.accessToken);
        })
      );
  }

  logout(): void {
    this.accessToken.next(null);
    this.refreshToken.next(null);
    this.user.next(null);
    this.authenticated.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authenticated.asObservable();
  }

  getAccessToken(): Observable<string | null> {
    return this.accessToken.asObservable();
  }

  getAccessTokenValue(): string | null {
    return this.accessToken.getValue();
  }

  getUser(): Observable<any> {
    return this.user.asObservable();
  }
}
