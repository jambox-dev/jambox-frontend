import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div class="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-3xl font-bold mb-6 text-center">Login</h2>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input type="email" formControlName="email" class="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none">
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input type="password" formControlName="password" class="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none">
          </div>

          <button type="submit" [disabled]="loginForm.invalid || loading" class="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded font-bold transition-colors disabled:opacity-50">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="mt-4 text-center">
          <p class="text-sm text-gray-400">Or login with</p>
          <div class="flex justify-center gap-4 mt-2">
            <button (click)="loginWithSpotify()" class="p-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors">
              Spotify
            </button>
            <!-- Add Google button here -->
          </div>
        </div>
        
        <div class="mt-6 text-center text-sm">
            <a routerLink="/register" class="text-purple-400 hover:text-purple-300">Don't have an account? Register</a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = false;

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.loading = false;
          // Show error notification
        }
      });
    }
  }

  loginWithSpotify(): void {
    // This is for USER login via Spotify (not yet implemented in backend for user auth, only tenant connection)
    // If backend supports OAuth2 login for users, redirect there.
    // Currently backend has /oauth2/authorization/spotify configured for login.
    window.location.href = `${environment.apiUrl}/oauth2/authorization/spotify`;
  }
}
