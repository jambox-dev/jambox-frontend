import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../core/services/notification.service';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-x-0 bottom-4 z-50 flex flex-col items-center px-4 pointer-events-none"
         aria-live="polite"
         aria-relevant="additions text">
      <div *ngFor="let n of notifications(); trackBy: trackById"
           class="toast-item w-full max-w-md mb-3 last:mb-0 pointer-events-auto select-none
                  border shadow-lg rounded-xl px-5 py-3 flex items-start gap-3
                  bg-white/95 backdrop-blur relative overflow-hidden
                  animate-[fadeIn_150ms_ease-out]"
           [ngClass]="typeClasses(n.type)"
           [attr.data-type]="n.type"
           [attr.role]="n.type === 'error' ? 'alert' : 'status'"
           [attr.aria-live]="n.type === 'error' ? 'assertive' : 'polite'">
        <!-- Accent bar -->
        <span class="absolute left-0 top-0 h-full w-1"
              [ngClass]="accentClasses(n.type)"></span>

        <!-- Icon -->
        <span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
              [ngClass]="iconBgClasses(n.type)">
          <svg *ngIf="n.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
               viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-7.07 7.07a1 1 0 01-1.415 0L3.293 9.95a1 1 0 011.414-1.414l3.1 3.1 6.364-6.364a1 1 0 011.414 0z"
                  clip-rule="evenodd"/>
          </svg>
          <svg *ngIf="n.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
               viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.536-10.95a1 1 0 00-1.414-1.414L10 8.586 7.879 6.464A1 1 0 006.464 7.88L8.586 10l-2.122 2.121a1 1 0 101.415 1.415L10 11.414l2.121 2.122a1 1 0 001.415-1.415L11.414 10l2.122-2.121z"
                  clip-rule="evenodd"/>
          </svg>
          <svg *ngIf="n.type === 'info'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
               viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zM9 9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.25 1.25 0 100 2.5A1.25 1.25 0 0010 5z"
                  clip-rule="evenodd"/>
          </svg>
        </span>

        <!-- Message -->
        <div class="text-sm font-medium text-gray-800 pr-6">
          {{ n.message }}
        </div>

        <!-- Progress bar -->
        <div class="absolute bottom-0 left-0 h-0.5"
             [ngClass]="accentClasses(n.type)"
             [style.width.%]="remainingPercent(n)"></div>

        <!-- Close button -->
        <button type="button"
                class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded"
                [attr.aria-label]="'Dismiss notification'"
                (click)="dismiss(n.id)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
               viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414
                  1.414L11.414 10l4.293 4.293a1 1 0 01-1.414
                  1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293
                  5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
      <div class="sr-only" aria-live="polite">Press Escape to dismiss latest notification.</div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px) scale(.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @media (prefers-reduced-motion: reduce) {
      .toast-item {
        animation: none !important;
        transition: none !important;
      }
    }
  `]
})
export class NotificationContainerComponent {
  private notificationService = inject(NotificationService);

  notifications = () => this._notifications;
  private _notifications: Notification[] = [];

  constructor() {
    this.notificationService.notifications$.subscribe(list => {
      this._notifications = list;
    });
  }

  @HostListener('window:keydown.escape')
  onEscape() {
    this.notificationService.dismissLatest();
  }

  trackById(_: number, n: Notification) { return n.id; }

  dismiss(id: string) {
    this.notificationService.dismiss(id);
  }

  remainingPercent(n: Notification) {
    const elapsed = Date.now() - n.createdAt;
    const pct = 100 - (elapsed / n.duration) * 100;
    return Math.max(0, Math.min(100, pct));
  }

  typeClasses(type: Notification['type']) {
    switch (type) {
      case 'success': return 'border-green-300';
      case 'error': return 'border-red-300';
      default: return 'border-blue-300';
    }
  }

  accentClasses(type: Notification['type']) {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  }

  iconBgClasses(type: Notification['type']) {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-600';
      case 'error': return 'bg-red-100 text-red-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  }
}