import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { MockMusicService, Song } from '../../core/services/mock-music.service';
import { NotificationService } from '../../core/services/notification.service';
import { AutoplayService } from '../../core/services/autoplay.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private service = inject(MockMusicService);
  private notifications = inject(NotificationService);
  private autoplayService = inject(AutoplayService);
  private sub: Subscription | undefined;

  // Live region announcement for accessibility
  ariaAnnouncement = '';

  pending: Song[] = [];
  queue: Song[] = [];

  ngOnInit(): void {
    this.sub = this.service.queue$.subscribe(songs => {
      this.pending = songs.filter(s => !s.approved);
      this.queue = songs.filter(s => s.approved);
    });
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
    this.ariaAnnouncement = msg;
  }

  accept(song: Song) {
    this.service.approveSong(song.id);
    this.notifications.success(`'${song.title}' has been added to the queue.`);
  }

  decline(song: Song) {
    this.service.removeFromQueue(song.id);
    this.notifications.info(`'${song.title}' has been declined.`);
  }

  remove(song: Song) {
    this.service.removeFromQueue(song.id);
  }

  clear() {
    this.service.clearQueue();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
