import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginFormService {
  private mockUser = {
    email: 'user@example.com',
    password: '123456',
    token: 'mocked-token',
  };

  login(credentials: { email: string; password: string }): Observable<{ token: string }> {
    if (
      credentials.email === this.mockUser.email &&
      credentials.password === this.mockUser.password
    ) {
      return of({ token: this.mockUser.token });
    } else {
      return of({ token: '' }); // Return an empty token for failed login
    }
  }
}