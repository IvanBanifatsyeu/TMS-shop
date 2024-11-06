import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SvgIconComponent } from '../../../shared/components/svg-icon/svg-icon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, SvgIconComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  passwordFieldType_s = signal<string>('password');
  form = this.formBuilder.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  errorMessage = signal<string | null>(null);

  onSubmit() {
    const rawForm = this.form.getRawValue();

    // 1. Client-Side Validation
    if (!rawForm.email || !rawForm.password) {
      // Display an error message to the user
      this.errorMessage.set('Please fill in all required fields.');
      return; // Stop the form submission
    }

    // 2. Proceed with Firebase Authentication
    this.authService
      .login(rawForm.email, rawForm.password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          // Handle specific error codes
          switch (err.code) {
            case 'auth/wrong-password':
              this.errorMessage.set('Incorrect password. Please try again.');
              break;
            case 'auth/invalid-credential':
              this.errorMessage.set(
                'User not found. Please check your email and password. And try again.'
              );
              break;
            case 'auth/invalid-email':
              this.errorMessage.set('Invalid email format.');
              break;
            default:
              this.errorMessage.set(
                'An error occurred. Please try again later.'
              );
          }
        },
      });
  }

  togglePasswordVisibility() {
    const newType =
      this.passwordFieldType_s() === 'password' ? 'text' : 'password';
    this.passwordFieldType_s.set(newType);
  }
}
