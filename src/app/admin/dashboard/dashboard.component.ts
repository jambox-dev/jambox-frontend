import { Component, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { MockMusicService, Song } from '../../core/services/mock-music.service';
import { NotificationService } from '../../core/services/notification.service';
import { AutoplayService } from '../../core/services/autoplay.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private service = inject(MockMusicService);
  private notifications = inject(NotificationService);
  private autoplayService = inject(AutoplayService);

  // Live region announcement for accessibility
  ariaAnnouncement = '';

  get queue(): Song[] {
    let snapshot: Song[] = [];
    const sub = this.service.queue$.subscribe((r: Song[]) => (snapshot = r));
    sub.unsubscribe();
    return snapshot;
  }

  get autoplay(): boolean {
    return this.autoplayService.isEnabled();
  }

  toggleAutoplay() {
    const enabled = this.autoplayService.toggle();
    const msg = enabled
      ? 'Autoplay enabled: songs auto-accepted.'
      : 'Autoplay disabled: review required.';
    this.notifications.info(msg);
    // Update polite live region
    this.ariaAnnouncement = msg;
  }

  remove(song: Song) {
    this.service.removeFromQueue(song.id);
  }

  clear() {
    this.service.clearQueue();
  }
}
