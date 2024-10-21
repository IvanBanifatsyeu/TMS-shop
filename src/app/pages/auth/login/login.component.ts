import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  router = inject(Router);
  http = inject(HttpClient);
  fb = inject(FormBuilder);

  form= this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit() {
    console.log('login');
  }
}
