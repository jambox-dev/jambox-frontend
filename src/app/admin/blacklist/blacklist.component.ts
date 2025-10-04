import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlacklistService } from '../../core/services/blacklist.service';
import { NotificationService } from '../../core/services/notification.service';
import { Song } from '../../core/models/song.model';
import { QueueService } from '../../core/services/queue.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueueSettings } from '../../core/models/queue.model';

@Component({
  selector: 'app-blacklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blacklist.component.html',
  styleUrls: ['./blacklist.component.css']
})
export class BlacklistComponent implements OnInit {
  private blacklistService = inject(BlacklistService);
  private notificationService = inject(NotificationService);
  private queueService = inject(QueueService);

  blacklist$!: Observable<Song[]>;
  blacklistEnabled$!: Observable<boolean>;
  newSongUrl = '';

  ngOnInit(): void {
    this.blacklist$ = this.blacklistService.getBlacklist();
    this.blacklistEnabled$ = this.queueService.getSettings().pipe(
      map((settings: QueueSettings) => settings.blacklistEnabled)
    );
  }

  blacklistSong(): void {
    if (this.newSongUrl) {
      this.blacklistService.blacklistSong(this.newSongUrl).subscribe({
        next: () => {
          this.notificationService.success('Song added to blacklist');
          this.newSongUrl = '';
          this.blacklist$ = this.blacklistService.getBlacklist();
        },
        error: (err) => {
          if (err.error === 'Song is in blacklist') {
            this.notificationService.info('Song is already in the blacklist');
          } else {
            this.notificationService.error('Failed to add song to blacklist');
          }
        }
      });
    }
  }

  unblacklistSong(song: Song): void {
    if (song.songUrl) {
      this.blacklistService.unblacklistSong(song.songUrl).subscribe(() => {
        this.notificationService.info('Song removed from blacklist');
        this.blacklist$ = this.blacklistService.getBlacklist();
      });
    }
  }

  toggleBlacklist(event: Event): void {
    const enabled = (event.target as HTMLInputElement).checked;
    this.queueService.updateSettings({ blacklistEnabled: enabled }).subscribe(() => {
      this.notificationService.info(`Blacklist ${enabled ? 'enabled' : 'disabled'}`);
    });
  }
}