import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, CommonModule, RegisterComponent, LoginComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent  {
  authService = inject(AuthService);
  activeButton = signal<string>('signin');

  logout() {
    this.authService.logout();
  }

  switchToLogin() {
    this.activeButton.set('signin');
  }

  switchToLogout() {
    this.activeButton.set('signup');
  }
}
