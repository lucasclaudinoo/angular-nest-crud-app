// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';	
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    canActivate: [authGuard],
    children: [
      // Outras rotas protegidas podem ser adicionadas aqui
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
