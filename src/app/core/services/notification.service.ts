import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationKind = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  type: NotificationKind;
  message: string;
  createdAt: number;
  duration: number; // ms
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<Notification[]>([]);
  readonly notifications$ = this.notificationsSubject.asObservable();

  /**
   * Push a notification (success/info/error). Auto-dismiss after duration.
   */
  push(type: NotificationKind, message: string, duration = 4000) {
    // Use crypto.randomUUID if available, otherwise generate a secure fallback
    const id = this.generateSecureId();
    const notification: Notification = {
      id,
      type,
      message,
      createdAt: Date.now(),
      duration
    };
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, notification]);

    setTimeout(() => this.dismiss(id), duration);
  }

  /**
   * Generate a cryptographically secure ID
   */
  private generateSecureId(): string {
    // Use crypto.randomUUID if available (modern browsers)
    if (crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Fallback using crypto.getRandomValues for better security
    if (crypto && crypto.getRandomValues) {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Final fallback for very old browsers (with timestamp to avoid collisions)
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).slice(2);
    return `${timestamp}-${random}`;
  }

  success(message: string, duration?: number) {
    this.push('success', message, duration);
  }

  error(message: string, duration?: number) {
    this.push('error', message, duration);
  }

  info(message: string, duration?: number) {
    this.push('info', message, duration);
  }

  dismiss(id: string) {
    const filtered = this.notificationsSubject.value.filter(n => n.id !== id);
    if (filtered.length !== this.notificationsSubject.value.length) {
      this.notificationsSubject.next(filtered);
    }
  }

  clearAll() {
    if (this.notificationsSubject.value.length) {
      this.notificationsSubject.next([]);
    }
  }
}