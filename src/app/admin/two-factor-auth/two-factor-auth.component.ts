import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { TwoFaCodeDirective } from './two-fa-code.directive';
import { FocusFirstInvalidService } from '../../core/services/focus-first-invalid.service';

@Component({
  selector: 'app-two-factor-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, TwoFaCodeDirective],
  templateUrl: './two-factor-auth.component.html',
  styleUrl: './two-factor-auth.component.css'
})
export class TwoFactorAuthComponent implements OnDestroy {
  // Raw digits (no dash)
  codeDigits = '';
  loading = false;
  submitted = false;

  // Resend / cooldown
  resent = false;
  cooldown = 0;
  private cooldownTimer: any;

  @ViewChild('codeInput') codeInput?: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private notifications: NotificationService,
    private focusInvalid: FocusFirstInvalidService
  ) {}

  // Value changes from directive (digits only)
  onCodeChange(d: string) {
    this.codeDigits = d;
  }

  // Emitted when full code length reached
  onCodeComplete(d: string) {
    this.codeDigits = d;
    if (!this.loading) {
      this.onSubmit(true);
    }
  }

  focusInput() {
    this.codeInput?.nativeElement.focus();
  }

  private startCooldown(seconds: number) {
    this.cooldown = seconds;
    this.clearCooldownTimer();
    this.cooldownTimer = setInterval(() => {
      this.cooldown--;
      if (this.cooldown <= 0) {
        this.clearCooldownTimer();
      }
    }, 1000);
  }

  private clearCooldownTimer() {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
      this.cooldownTimer = null;
    }
  }

  onSubmit(auto = false) {
    this.submitted = true;

    if (this.codeDigits.length < 6) {
      if (!auto) {
        this.notifications.error('Enter the 6-digit code.');
        // Use reusable focus helper; fallback to direct focus
        this.focusInvalid.focus();
        if (document.activeElement === document.body) {
          this.focusInput();
        }
      }
      return;
    }

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.notifications.success('2FA verified. Redirecting...');
      this.router.navigate(['admin', 'dashboard']);
    }, 500);
  }

  resend() {
    if (this.loading || this.cooldown > 0) return;
    this.resent = true;
    this.notifications.info('New 2FA code sent (simulated).');
    this.startCooldown(30);
    setTimeout(() => (this.resent = false), 3000);
  }

  ngOnDestroy(): void {
    this.clearCooldownTimer();
  }
}
