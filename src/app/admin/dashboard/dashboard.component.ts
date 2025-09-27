import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule, NgFor } from '@angular/common';
import { Song } from '../../core/models/song.model';
import { NotificationService } from '../../core/services/notification.service';
import { map, Observable, Subscription, switchMap, take } from 'rxjs';
import { QueueService } from '../../core/services/queue.service';
import { SpotifyService } from '../../core/services/spotify.service';
import { ApprovalQueue } from '../../core/models/queue.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private queueService = inject(QueueService);
  private spotifyService = inject(SpotifyService);
  private notifications = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  // Live region announcement for accessibility
  ariaAnnouncement = '';

  public pending$!: Observable<Song[]>;
  public queue$!: Observable<Song[]>;
  public autoplay$!: Observable<boolean>;
  public spotifyLoginUrl = `${environment.apiUrl}/spotify/login`;
  public isSpotifyLoggedIn$!: Observable<boolean>;

  ngOnInit(): void {
    this.autoplay$ = this.queueService.getSettings().pipe(
      map(settings => !settings.needsApproval)
    );
    this.pending$ = this.queueService.getQueueNeedsApproval();
    this.queue$ = this.queueService.getQueue();
    this.isSpotifyLoggedIn$ = this.spotifyService.isLoggedIn();

  }

  toggleAutoplay() {
    this.autoplay$.pipe(
      take(1),
      switchMap(autoplay => this.queueService.updateSettings(autoplay))
    ).subscribe(() => {
      this.autoplay$.pipe(take(1)).subscribe(autoplay => {
        const msg = autoplay
          ? 'Autoplay enabled: songs auto-accepted.'
          : 'Autoplay disabled: review required.';
        this.notifications.info(msg);
        this.ariaAnnouncement = msg;
        this.cdr.markForCheck();
      });
    });
  }

  accept(song: Song) {
    this.queueService.approveSong({ queue_id: song.id, approved: true }).subscribe(() => {
      this.notifications.success(`'${song.title}' has been added to the queue.`);
      this.ngOnInit(); // Refresh lists
    });
  }

  decline(song: Song) {
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


}
