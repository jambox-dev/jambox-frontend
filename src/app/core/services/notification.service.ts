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

  // Max number of notifications shown simultaneously
  private readonly maxStack = 4;

  /**
   * Push a notification (success/info/error). Auto-dismiss after duration.
   * Stack capped to maxStack (oldest removed first).
   */
  push(type: NotificationKind, message: string, duration = 4000) {
    const id = (globalThis as any).crypto?.randomUUID
      ? (globalThis as any).crypto.randomUUID()
      : Math.random().toString(36).slice(2);

    const notification: Notification = {
      id,
      type,
      message,
      createdAt: Date.now(),
      duration
    };

    const current = [...this.notificationsSubject.value, notification];
    // Enforce max stack size by trimming oldest
    if (current.length > this.maxStack) {
      current.splice(0, current.length - this.maxStack);
    }
    this.notificationsSubject.next(current);

    // Auto-dismiss
    setTimeout(() => this.dismiss(id), duration);
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

  dismissLatest() {
    const list = this.notificationsSubject.value;
    if (!list.length) return;
    const latest = list[list.length - 1].id;
    this.dismiss(latest);
  }

  clearAll() {
    if (this.notificationsSubject.value.length) {
      this.notificationsSubject.next([]);
    }
  }
}