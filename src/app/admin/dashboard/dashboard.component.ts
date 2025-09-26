import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Song } from '../../core/models/song.model';
import { NotificationService } from '../../core/services/notification.service';
import { AutoplayService } from '../../core/services/autoplay.service';
import { Subscription } from 'rxjs';
import { QueueService } from '../../core/services/queue.service';
import { ApprovalQueue } from '../../core/models/queue.model';
import { SpotifyService } from '../../core/services/spotify.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private queueService = inject(QueueService);
  private spotifyService = inject(SpotifyService);
  private notifications = inject(NotificationService);
  private autoplayService = inject(AutoplayService);
  private sub: Subscription | undefined;

  // Live region announcement for accessibility
  ariaAnnouncement = '';

  pending: ApprovalQueue[] = [];
  queue: Song[] = [];

  ngOnInit(): void {
    this.sub = this.queueService.getQueueNeedsApproval().subscribe(pending => this.pending = pending);
    this.sub.add(this.queueService.getQueue().subscribe(queue => this.queue = queue));
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

  accept(song: ApprovalQueue) {
    this.queueService.approveSong({ queue_id: song.id, approved: true }).subscribe(() => {
      this.notifications.success(`'${song.title}' has been added to the queue.`);
      this.ngOnInit(); // Refresh lists
    });
  }

  decline(song: ApprovalQueue) {
    this.queueService.approveSong({ queue_id: song.id, approved: false }).subscribe(() => {
      this.notifications.info(`'${song.title}' has been declined.`);
      this.ngOnInit(); // Refresh lists
    });
  }

  remove(song: Song) {
    // This functionality does not exist in the new services, will be removed.
  }

  clear() {
    // This functionality does not exist in the new services, will be removed.
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
  loginWithSpotify() {
    this.spotifyService.login().subscribe(response => {
      window.location.href = response.headers.get('Location');
    });
  }
}
