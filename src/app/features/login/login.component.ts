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
  ) {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
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

  validateForm(emailErrorMessage?: string): void {

    
    this.submitted = true;

    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;




    if (!this.loginForm.get('email')?.value && !this.loginForm.get('password')?.value) {
      emailControl?.setErrors({ 'invalid': true });
      this.emailErrorMessage = this.EMAIL_REQUIRED_MESSAGE;
      passwordControl?.setErrors({ 'invalid': true });
      this.passwordErrorMessage = 'Digite uma senha';

    }




    if (!emailControl?.value) {
      this.emailErrorMessage = this.EMAIL_REQUIRED_MESSAGE;
    }



    if (emailControl) {
      let isValidEmail = emailRegex.test(emailControl.value);
  
      emailControl.setValidators([Validators.required, Validators.email]);

  
      if (!emailControl.value) {
        this.emailErrorMessage = 'Por favor digite seu email cadastrado (email de cadastro)';
      } else if (!isValidEmail) {
        emailControl.setErrors({ 'invalid': true });
        console.log('Email inválido');
        this.emailErrorMessage = 'Digite um email valido';
      } else {
        this.emailErrorMessage = '';
        emailControl.setErrors(null);
      }
    }

    this.loginForm.markAllAsTouched();

    if (passwordControl) {
      if (!passwordControl.value) {
        passwordControl.setErrors({ 'invalid': true });
        this.passwordErrorMessage = 'Digite uma senha';
      } else {
        passwordControl.clearValidators();
        this.passwordErrorMessage = '';
        passwordControl.setErrors(null); 
      }
    }
  }
  login(): void {
    this.invalidCrendentialsText = false;
    this.validateForm();
  
    if (this.loginForm.invalid) {
      return;
    }
  
    this.isLoading = true;
    if (this.loginForm.get('email')?.value && this.loginForm.get('password')?.value) {
      console.log('Login');
      this.authService.login({
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      }).subscribe(
        (response: { accessToken: string, refreshToken: string, error?: string }) => {
          this.isLoading = false;
          if (response.accessToken) {
            this.router.navigate(['/home']);
          } 
        },
        (error: any) => {
          this.invalidCrendentialsText = true;
          this.validateForm();
          this.isLoading = false;
        }
      );
    } else {
      this.invalidCrendentialsText = true;
      this.isLoading = false;
      this.validateForm();
    }
  }
  
}