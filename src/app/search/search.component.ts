import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { MockMusicService, Song } from '../core/services/mock-music.service';
import { NotificationService } from '../core/services/notification.service';
import { AutoplayService } from '../core/services/autoplay.service';
import { Subject, Subscription, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchResultsComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnDestroy {
  private service = inject(MockMusicService);
  private notifications = inject(NotificationService);
  private autoplayService = inject(AutoplayService);

  // UI state
  query = '';
  loading = false;
  lastAddedSongId: string | null = null;

  // Debounce stream
  private queryInput$ = new Subject<string>();
  private sub: Subscription;

  constructor() {
    // Debounce search input: trim + ignore consecutive duplicates + 300ms delay
    this.sub = this.queryInput$
      .pipe(
        map(v => v.replace(/\s+/g, ' ')), // collapse inner whitespace
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(val => {
        this.query = val;
        if (!this.query.trim()) {
          this.service.searchSongs('').subscribe();
          this.lastAddedSongId = null;
        } else {
          this.performSearch();
        }
      });
  }

  onQueryChange(value: string) {
    this.query = value;
    this.queryInput$.next(value);
  }

  performSearch() {
    if (!this.query.trim()) {
      this.service.searchSongs('').subscribe();
      this.lastAddedSongId = null;
      return;
    }

    this.loading = true;
    const current = this.query.trim();
    this.service.searchSongs(current).subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notifications.error('Search failed.');
      }
    });
  }

  handleAdd(song: Song) {
    try {
      const autoplay = this.autoplayService.isEnabled();
      this.service.addToQueue(song, autoplay);
      this.lastAddedSongId = song.id;

      if (autoplay) {
        const pos = this.service.getSongPosition(song.id);
        this.notifications.success(
          pos
            ? `Song added. Position in queue: ${pos}.`
            : 'Song added to queue.'
        );
      } else {
        this.notifications.success('Song added to queue. Waiting for approval.');
      }
    } catch {
      this.notifications.error('Could not add song.');
    }
  }

  clearQuery() {
    this.query = '';
    this.queryInput$.next('');
    this.service.searchSongs('').subscribe();
    this.notifications.info('Search cleared', 2500);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
