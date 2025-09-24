import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { FocusFirstInvalidService } from '../../core/services/focus-first-invalid.service';

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
  submitted = false;
  showPassword = false;

  @ViewChild('usernameInput') usernameInput?: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput?: ElementRef<HTMLInputElement>;
  @ViewChild('loginFormRef') loginFormRef?: NgForm;

  constructor(
    private router: Router,
    private notifications: NotificationService,
    private focusInvalid: FocusFirstInvalidService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  private focusFirstInvalid() {
    // Delegate to reusable service (falls back to manual focus)
    this.focusInvalid.focus();
    if (document.activeElement === document.body) {
      if (!this.username.trim()) {
        this.usernameInput?.nativeElement.focus();
      } else if (!this.password.trim()) {
        this.passwordInput?.nativeElement.focus();
      }
    }
  }

  onSubmit() {
    this.submitted = true;

    const userValid = !!this.username.trim();
    const passValid = !!this.password.trim();

    if (!userValid || !passValid) {
      this.notifications.error('Fix highlighted fields.');
      this.focusFirstInvalid();
      return;
    }

    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      this.notifications.success('Credentials accepted.');
      this.router.navigate(['admin', '2fa']);
    }, 600);
  }
}
