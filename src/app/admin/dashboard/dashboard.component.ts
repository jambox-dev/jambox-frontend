import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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
  private subscriptions = new Subscription();

  queue: Song[] = [];

  ngOnInit() {
    // Properly manage subscription to prevent memory leaks
    this.subscriptions.add(
      this.service.queue$.subscribe(queue => {
        this.queue = queue;
      })
    );
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.unsubscribe();
  }

  get autoplay(): boolean {
    return this.autoplayService.isEnabled();
  }

  toggleAutoplay() {
    const enabled = this.autoplayService.toggle();
    this.notifications.info(
      enabled
        ? 'Autoplay enabled: songs auto-accepted.'
        : 'Autoplay disabled: review required.'
    );
  }

  acceptSong(song: Song) {
    // In a real application, this would mark the song as accepted
    // For now, we'll just remove it from the queue and show a success message
    this.service.removeFromQueue(song.id);
    this.notifications.success(`"${song.title}" accepted and will play next.`);
  }

  remove(song: Song) {
    if (!song || !song.id) {
      this.notifications.error('Invalid song data.');
      return;
    }

    try {
      this.service.removeFromQueue(song.id);
      this.notifications.success(`"${song.title}" removed from queue.`);
    } catch (error) {
      console.error('Error removing song:', error);
      this.notifications.error('Failed to remove song.');
    }
  }

  clear() {
    if (this.queue.length === 0) {
      this.notifications.info('Queue is already empty.');
      return;
    }

    const count = this.queue.length;
    this.service.clearQueue();
    this.notifications.success(`Cleared ${count} song${count !== 1 ? 's' : ''} from queue.`);
  }

  trackBySongId(index: number, song: Song): string {
    return song.id;
  }
}
