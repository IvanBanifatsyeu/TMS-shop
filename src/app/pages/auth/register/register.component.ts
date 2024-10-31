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
import { CommonModule } from '@angular/common';
import { ProductFirebaseService } from '../../../core/services/product-firebase.service';
import { SvgIconComponent } from '../../../shared/components/svg-icon/svg-icon.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SvgIconComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  firebaseService = inject(ProductFirebaseService);
  userId_s = signal<string | null>(null);
  passwordFieldType_s = signal<string>('password');

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  errorMessage = signal<string | null>(null);

  onSubmit() {
    const rawForm = this.form.getRawValue();

    // 1. Client-Side Validation
    if (!rawForm.email || !rawForm.username || !rawForm.password) {
      // Display an error message to the user
      this.errorMessage.set('Please fill in all required fields.');
      return; // Stop the form submission
    }

    // 2. Proceed with Firebase Authentication
    this.authService
      .register(rawForm.email, rawForm.username, rawForm.password)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          switch (err.code) {
            case 'auth/invalid-email':
              this.errorMessage.set('Please enter a valid email address.');
              break;
            case 'auth/weak-password':
              this.errorMessage.set(
                'Password must be at least 6 characters long.'
              );
              break;
            case 'auth/email-already-in-use':
              this.errorMessage.set(
                'This email address is already in use. Please choose a different address.'
              );
              break;
            default:
              this.errorMessage.set(
                'An error occurred. Please try again later.'
              );
          }
        },
      });
  }

  togglePasswordVisibility(event: Event) {
    event.stopPropagation();

    this.passwordFieldType_s() === 'password'
      ? this.passwordFieldType_s.set('text')
      : this.passwordFieldType_s.set('password');
  }
}
