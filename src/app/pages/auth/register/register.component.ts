import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  router = inject(Router);
  http = inject(HttpClient);
  fb = inject(FormBuilder);
  authService = inject(AuthService);

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
      .subscribe({
        next: () => {
          this.authService.currentUser_s.set({
            email: rawForm.email,
            username: rawForm.username,
          });
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.log('err.code register ❌❌❌❌❌', err.code);

          // Handle specific error codes
          switch (err.code) {
            case 'auth/invalid-email':
              this.errorMessage.set('Please enter a valid email address.');
              break;
            case 'auth/weak-password':
              this.errorMessage.set(
                'Password must be at least 6 characters long.'
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
}
