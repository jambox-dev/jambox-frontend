import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';

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
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      if (this.username.trim() && this.password.trim()) {
        this.notifications.success('Credentials accepted. Proceed to 2FA.', 2500);
        this.router.navigate(['admin', '2fa']);
      } else {
        this.notifications.error('Please enter username and password.');
      }
    }, 400);
  }
}
