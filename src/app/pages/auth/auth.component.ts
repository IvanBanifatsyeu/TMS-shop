import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserInterface } from '../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit {
  authService = inject(AuthService);
  
ngOnInit() {
  this.authService.user$.subscribe((user: any) => {
    
    if (user) {
      this.authService.currentUser_s.set({
        email: user.email,
        username: user.displayName,
      });
    } else {
      this.authService.currentUser_s.set(null);
    }
  });
  
}
  logout() {
    this.authService.logout();
  }

}
