import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Song } from '../../core/models/song.model';
import { NotificationService } from '../../core/services/notification.service';
import { map, Observable, Subscription, switchMap, take, firstValueFrom, startWith, Subject } from 'rxjs';
import { QueueService } from '../../core/services/queue.service';
import { SpotifyService } from '../../core/services/spotify.service';
import { BlacklistService } from '../../core/services/blacklist.service';
import { ApprovalQueue } from '../../core/models/queue.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private queueService = inject(QueueService);
  private spotifyService = inject(SpotifyService);
  private notifications = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);
  private blacklistService = inject(BlacklistService);

  // Live region announcement for accessibility
  ariaAnnouncement = '';
  private refresh$ = new Subject<void>();

  public pending$!: Observable<Song[]>;
  public queue$!: Observable<Song[]>;
  public autoplay$!: Observable<boolean>;
  public spotifyLoginUrl = `${environment.apiUrl}/spotify/login`;
  public isSpotifyLoggedIn$!: Observable<boolean>;

  ngOnInit(): void {
    this.isSpotifyLoggedIn$ = this.spotifyService.isLoggedIn();

    const refresh$ = this.refresh$.pipe(startWith(undefined));

    this.autoplay$ = refresh$.pipe(
      switchMap(() => this.queueService.getSettings()),
      map((settings: { needsApproval: any; }) => !settings.needsApproval)
    );

    this.pending$ = refresh$.pipe(
      switchMap(() => this.queueService.getQueueNeedsApproval())
    );

    this.queue$ = refresh$.pipe(
      switchMap(() => this.queueService.getQueue())
    );

  }

  async toggleAutoplay() {
    const currentAutoplay = await firstValueFrom(this.autoplay$);
    await firstValueFrom(this.queueService.updateSettings({ needsApproval: !currentAutoplay }));
    const newAutoplay = await firstValueFrom(this.autoplay$);
    const msg = newAutoplay
      ? 'Autoplay enabled: songs auto-accepted.'
      : 'Autoplay disabled: review required.';
    this.notifications.info(msg);
    this.ariaAnnouncement = msg;
    this.cdr.markForCheck();
    this.refresh$.next();
  }

  async accept(song: Song) {
    await firstValueFrom(this.queueService.approveSong({ queue_id: song.id, approved: true }));
    this.notifications.success(`'${song.title}' has been added to the queue.`);
    this.refresh$.next();
  }

  async decline(song: Song) {
    await firstValueFrom(this.queueService.approveSong({ queue_id: song.id, approved: false }));
    this.notifications.info(`'${song.title}' has been declined.`);
    this.refresh$.next();
  }

  async blacklist(song: Song) {
    if (song.songUrl) {
      await firstValueFrom(this.blacklistService.blacklistSong(song.songUrl));
      this.notifications.success(`'${song.title}' has been blacklisted.`);
      await this.decline(song);
    }
  }

  remove(song: Song) {
    // This functionality does not exist in the new services, will be removed.
  }

  clear() {
    // This functionality does not exist in the new services, will be removed.
  }


}
