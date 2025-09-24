import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-two-factor-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './two-factor-auth.component.html',
  styleUrl: './two-factor-auth.component.css'
})
export class TwoFactorAuthComponent {
  /**
   * Display value includes optional dash (###-###).
   * Internal validation strips non-digits.
   */
  code = '';
  loading = false;
  resent = false;

  constructor(private router: Router, private notifications: NotificationService) {}

  onCodeInput(raw: string) {
    // Keep only digits
    const digits = raw.replace(/\D/g, '').slice(0, 6);
    // Insert dash after first 3 digits if more than 3 total
    if (digits.length > 3) {
      this.code = digits.slice(0, 3) + '-' + digits.slice(3);
    } else {
      this.code = digits;
    }
  }

  private digitsOnly(): string {
    return this.code.replace(/\D/g, '');
  }

  onSubmit() {
    const digits = this.digitsOnly();
    
    // Validate code format
    if (digits.length !== 6) {
      this.notifications.error('Enter the complete 6-digit code.');
      return;
    }

    // Validate that it's all numeric
    if (!/^\d{6}$/.test(digits)) {
      this.notifications.error('Code must contain only numbers.');
      return;
    }

    this.loading = true;
    
    // Simulate 2FA verification with specific demo code
    setTimeout(() => {
      this.loading = false;
      
      // TODO: Replace with actual 2FA service verification
      // For demo purposes, accept specific code to prevent unauthorized access
      if (digits === '123456') {
        this.notifications.success('2FA verified. Redirecting...', 2500);
        this.router.navigate(['admin', 'dashboard']);
      } else {
        this.notifications.error('Invalid or expired code.');
        // Clear code for security
        this.code = '';
      }
    }, 1000); // Increased delay to prevent brute force attempts
  }

  resend() {
    if (this.loading || this.resent) return;
    this.resent = true;
    this.notifications.info('New 2FA code sent (simulated).', 3000);
    setTimeout(() => (this.resent = false), 3000);
  }
}
