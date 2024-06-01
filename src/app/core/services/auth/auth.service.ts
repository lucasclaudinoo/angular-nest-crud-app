import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private mockUser = {
    email: 'user@example.com',
    password: '123456',
    token: 'mocked-token',
  };
  private authenticated = false;


  login(credentials: { email: string; password: string }): Observable<{ token: string, error?: string }> {
    if (credentials.email === this.mockUser.email && credentials.password === this.mockUser.password) {
        this.authenticated = true;
        return of({ token: this.mockUser.token });
    } else {
        if (credentials.email !== this.mockUser.email) {
            return of({ token: '', error: 'Email' });
        } else {
            return of({ token: '' });
        }
    }
}

  logout(): void {
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }
}
