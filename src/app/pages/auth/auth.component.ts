import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserDataService } from '../../core/services/user-data.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, CommonModule, RegisterComponent, LoginComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  authService = inject(AuthService);
  activeButton = signal<string>('signin');
  userDataService = inject(UserDataService);

  ngOnInit() {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.authService.currentUser_s.set({
          email: user.email,
          username: user.displayName,
          userId: user.uid,
        });
      } else {
        this.authService.currentUser_s.set(null);
      }
    });
  }
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
