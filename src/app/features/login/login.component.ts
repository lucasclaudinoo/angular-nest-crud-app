import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl  } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatSpinner } from '@angular/material/progress-spinner';


@Component({
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    ReactiveFormsModule,
    CommonModule,
    MatSpinner
  ],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  submitted = false;
  invalidCredentials = false;
  emailErrorMessage: string | undefined;
  passwordErrorMessage: string | undefined;
  invalidCredentialsText = false;
  isLoading = false;

  private readonly EMAIL_REQUIRED_MESSAGE = 'Por favor digite seu email cadastrado (email de cadastro)';
  private readonly EMAIL_INVALID_MESSAGE = 'Digite um email válido';
  private readonly PASSWORD_REQUIRED_MESSAGE = 'Digite uma senha';
  private readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });

    this.loginForm.get('email')?.valueChanges.subscribe(() => {
      if (this.submitted) {
        this.validateForm();
      }
    });

    this.loginForm.get('password')?.valueChanges.subscribe(() => {
      if (this.submitted) {
        this.validateForm();
      }
    });
  }

  ngOnInit(): void {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  validateForm(): void {
    this.submitted = true;

    const emailControl = this.email;
    const passwordControl = this.password;

    if (emailControl) {
      if (!emailControl.value) {
        emailControl.setErrors({ required: true });
        this.emailErrorMessage = this.EMAIL_REQUIRED_MESSAGE;
      } else if (!this.EMAIL_REGEX.test(emailControl.value)) {
        emailControl.setErrors({ pattern: true });
        this.emailErrorMessage = this.EMAIL_INVALID_MESSAGE;
      } else {
        emailControl.setErrors(null);
        this.emailErrorMessage = undefined;
      }
    }

    if (passwordControl) {
      if (!passwordControl.value) {
        passwordControl.setErrors({ required: true });
        this.passwordErrorMessage = this.PASSWORD_REQUIRED_MESSAGE;
      } else {
        passwordControl.setErrors(null);
        this.passwordErrorMessage = undefined;
      }
    }

    if (this.invalidCredentialsText) {
      if (emailControl) {
        emailControl.setErrors({ invalidCredentials: true });
      }
      if (passwordControl) {
        passwordControl.setErrors({ invalidCredentials: true });
      }
      this.emailErrorMessage = 'Credenciais inválidas';
      this.passwordErrorMessage = 'Credenciais inválidas';
    }

    this.loginForm.markAllAsTouched();
  }

  login(): void {
    this.invalidCredentialsText = false;
    this.validateForm();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.login({
      email: this.email?.value,
      password: this.password?.value
    }).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      () => {
        this.isLoading = false;
        this.validateForm();
        this.invalidCredentialsText = true;
      }
    );
  
  }
}