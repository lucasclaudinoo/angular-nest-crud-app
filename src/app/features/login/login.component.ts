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
    CommonModule
  ],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  implements OnInit {
  loginForm: FormGroup;
  hide = true;
  submitted = false;
  public emailErrorMessage: string | undefined;
  public passwordErrorMessage: string | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef
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

  ngOnInit(): void {
  }

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
      }
    }
  
    this.loginForm.markAllAsTouched();
  
    if (passwordControl) {
        if (!passwordControl.value) {
            console.log('Senha inválida');
            passwordControl.setErrors({ 'invalid': true });
            this.passwordErrorMessage = 'Digite uma senha';
        } else {
            passwordControl.clearValidators();
            this.passwordErrorMessage = '';
        }
    }
  }
  

  login(): void {
      const emailValue = this.loginForm.get('email')?.value;
      const passwordValue = this.loginForm.get('password')?.value;

      if (!emailValue || !passwordValue) {
          this.validateForm();
          return;
      } else {
          console.log("Formulário enviado");
          this.authService.login(this.loginForm.value).subscribe(
              (response: { token: string, error?: string }) => {
                  if (response.token) {
                      console.log('Login bem-sucedido', response);
                      this.router.navigate(['/home']);
                  } else {
                      console.error('Login falhou');
                      console.log('Resposta', response);
                      this.validateForm(response.error);
                  }
              }
          );
      }
  }
}