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
  // Variáveis definidas no início do componente
  loginForm: FormGroup;
  hide = true;
  submitted = false;
  invalidCredentials = false;
  emailErrorMessage: string | undefined;
  passwordErrorMessage: string | undefined;
  invalidCrendentialsText: boolean = false;
  isLoading: boolean = false;



  private readonly EMAIL_REQUIRED_MESSAGE = 'Por favor digite seu email cadastrado (email de cadastro)';
  private readonly EMAIL_INVALID_MESSAGE = 'Digite um email valido';
  private readonly PASSWORD_REQUIRED_MESSAGE = 'Digite uma senha';

  private readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.loginForm.valueChanges.subscribe(() => {
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

    if (this.invalidCredentials) {
      this.invalidCrendentialsText = true
      if (emailControl) {
        emailControl.setErrors({ 'invalid': true });
      }
      if (passwordControl) {
        passwordControl.setErrors({ 'invalid': true });
      }
      this.invalidCredentials = false;
    }

    if (emailControl) {
      const isValidEmail = this.EMAIL_REGEX.test(emailControl.value);

      if (emailControl.invalid && emailControl.errors?.['required']) {
        this.emailErrorMessage = this.EMAIL_REQUIRED_MESSAGE;
      } else if (!isValidEmail) {
        this.emailErrorMessage = this.EMAIL_INVALID_MESSAGE;
        emailControl.setErrors({ 'invalid': true });
      } else {
        this.emailErrorMessage = '';
      }
    }

    if (passwordControl) {
      if (passwordControl.invalid && passwordControl.errors?.['required']) {
        this.passwordErrorMessage = this.PASSWORD_REQUIRED_MESSAGE;
      } else {
        this.passwordErrorMessage = '';
      }
    }

    this.loginForm.markAllAsTouched();
  }

  login(): void {
    this.validateForm();

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe(
      (response: { token: string, error?: string }) => {
        this.isLoading = true;
        if (response.token) {
          this.router.navigate(['/home']);
        } else {
          this.invalidCredentials = true;
          this.validateForm();
        }
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Erro no login', error);
      }
    );
  }
}