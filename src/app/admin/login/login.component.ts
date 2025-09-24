import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;

  constructor(private router: Router, private notifications: NotificationService) {}

  onSubmit() {
    // Input validation
    const username = this.username.trim();
    const password = this.password.trim();

    if (!username || !password) {
      this.notifications.error('Please enter username and password.');
      return;
    }

    // Basic length validation using environment configuration
    if (username.length < 3 || password.length < environment.limits.minPasswordLength) {
      this.notifications.error('Invalid username or password format.');
      return;
    }

    // Validate maximum username length  
    if (username.length > environment.limits.maxUsernameLength) {
      this.notifications.error('Username too long.');
      return;
    }

    // Sanitize inputs to prevent XSS
    const sanitizedUsername = username.replace(/[<>&"'/]/g, '');
    if (sanitizedUsername !== username) {
      this.notifications.error('Invalid characters in username.');
      return;
    }

    this.loading = true;

    // Simulate authentication with basic validation
    // Note: In production, this should call a secure backend API
    setTimeout(() => {
      this.loading = false;
      
      // TODO: Replace with actual authentication service
      // For now, require specific demo credentials to prevent unauthorized access
      if (username === 'admin' && password === 'demo123') {
        this.notifications.success('Credentials accepted. Proceed to 2FA.', 2500);
        this.router.navigate(['admin', '2fa']);
      } else {
        this.notifications.error('Invalid credentials.');
        // Clear password for security
        this.password = '';
      }
    }, 800); // Increased delay to prevent timing attacks
  }
}
