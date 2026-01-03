import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div class="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-3xl font-bold mb-6 text-center">Get Started</h2>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input type="email" formControlName="email" class="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none">
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input type="password" formControlName="password" class="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none">
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Tenant Name (e.g. My Bar)</label>
            <input type="text" formControlName="tenantName" class="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none">
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Subdomain (e.g. mybar)</label>
            <div class="flex">
                <input type="text" formControlName="subdomain" class="w-full p-2 rounded-l bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none">
                <span class="p-2 bg-gray-600 rounded-r border border-l-0 border-gray-600 text-gray-300">.jambox.dev</span>
            </div>
            <p class="text-xs text-gray-400 mt-1">Your site will be at https://{{registerForm.get('subdomain')?.value}}.jambox.dev</p>
          </div>

          <button type="submit" [disabled]="registerForm.invalid || loading" class="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded font-bold transition-colors disabled:opacity-50">
            {{ loading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>
        
        <div class="mt-6 text-center text-sm">
            <a routerLink="/login" class="text-purple-400 hover:text-purple-300">Already have an account? Login</a>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    registerForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        tenantName: ['', Validators.required],
        subdomain: ['', [Validators.required, Validators.pattern('^[a-z0-9-]+$')]]
    });

    loading = false;

    onSubmit() {
        if (this.registerForm.valid) {
            this.loading = true;
            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    // Redirect to the new subdomain? Or login page?
                    // For now, maybe login page or dashboard if auto-logged in.
                    // AuthService.register returns AuthResponse with token.
                    // We should probably redirect to the tenant subdomain.
                    const subdomain = this.registerForm.get('subdomain')?.value;
                    // In dev: http://subdomain.localhost:4200
                    // In prod: https://subdomain.jambox.dev

                    const protocol = window.location.protocol;
                    const host = window.location.hostname;
                    let newUrl = '';

                    if (host.includes('localhost')) {
                        newUrl = `${protocol}//${subdomain}.localhost:4200`;
                    } else {
                        newUrl = `${protocol}//${subdomain}.jambox.dev`;
                    }

                    window.location.href = newUrl;
                },
                error: (err) => {
                    console.error('Registration failed', err);
                    this.loading = false;
                    // Show error
                }
            });
        }
    }
}
