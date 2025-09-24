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
    if (digits.length < 6) {
      this.notifications.error('Enter the 6-digit code.');
      return;
    }
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.notifications.success('2FA verified. Redirecting...', 2500);
      this.router.navigate(['admin', 'dashboard']);
    }, 500);
  }

  resend() {
    if (this.loading || this.resent) return;
    this.resent = true;
    this.notifications.info('New 2FA code sent (simulated).', 3000);
    setTimeout(() => (this.resent = false), 3000);
  }
}
