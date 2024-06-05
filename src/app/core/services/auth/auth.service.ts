import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private authenticated = new BehaviorSubject<boolean>(false);
  private accessToken = new BehaviorSubject<string | null>(null);
  private user = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
  }





  login(credentials: { email: string; password: string }): Observable<{ accessToken: string; userId: number }> {
    return this.http.post<{ accessToken: string; userId: number }>(`${this.apiUrl}/login`, credentials, { withCredentials: true })
      .pipe(
        tap(response => {
          console.log('Resposta da API de login:', response); // Log da resposta da API
          this.saveTokens(response.accessToken, response.userId); // Passa tanto o accessToken quanto o userId para saveTokens
        }),
        catchError(error => {
          console.error('Erro na chamada da API de login:', error); // Log detalhado do erro
          throw new Error('Authentication failed'); // Lança um erro para ser capturado pelo código que chama o login
        })
      );
  }

  private saveTokens(accessToken: string, userId: number): void {
    if (!accessToken || !userId) {
      console.error('Tokens inválidos:', { accessToken, userId });
      throw new Error('Invalid tokens');
    }
    this.authenticated.next(true);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('userId', userId.toString());
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
