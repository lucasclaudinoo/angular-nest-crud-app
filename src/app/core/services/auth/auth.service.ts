import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private authenticated = new BehaviorSubject<boolean>(false);
  private accessToken = new BehaviorSubject<string | null>(null);
  private user = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    // Assumindo que o accessToken ainda não está armazenado em lugar algum
    // Poderia adicionar lógica para verificar um possível token armazenado se necessário
  }

  private saveTokens(accessToken: string, user: any) {
    this.accessToken.next(accessToken);
    this.user.next(user);
    this.authenticated.next(true);
  }
  login(credentials: { email: string; password: string }): Observable<{ accessToken: string; user: any }> {
    return this.http.post<{ accessToken: string; user: any }>(`${this.apiUrl}/login`, credentials, { withCredentials: true })
      .pipe(
        tap(response => {
          this.saveTokens(response.accessToken, response.user);
        })
      );
  }
  refreshAccessToken(): Observable<{ accessToken: string | null; }> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/refresh`, {}, { withCredentials: true })
      .pipe(
        tap(response => {
          this.accessToken.next(response.accessToken);
        }),
        catchError(() => {
          this.logout();
          return of({ accessToken: null });
        })
      );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe(() => {
      this.accessToken.next(null);
      this.user.next(null);
      this.authenticated.next(false);
    });
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
