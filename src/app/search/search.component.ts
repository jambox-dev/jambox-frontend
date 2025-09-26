import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { QueueComponent } from '../queue/queue.component';
import { Song } from '../core/models/song.model';
import { NotificationService } from '../core/services/notification.service';
import { Subject, Subscription, debounceTime, distinctUntilChanged, map, switchMap, Observable } from 'rxjs';
import { CompletionService } from '../core/services/completion.service';
import { SongService } from '../core/services/song.service';
import { QueueService } from '../core/services/queue.service';
import { SpotifyService } from '../core/services/spotify.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchResultsComponent, QueueComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnDestroy {
  public songService = inject(SongService);
  private queueService = inject(QueueService);
  private completionService = inject(CompletionService);
  private notifications = inject(NotificationService);
  private spotifyService = inject(SpotifyService);

  // UI state
  query = '';
  loading = false;
  lastAddedSongId: string | null = null;
  completions: string[] = [];
  highlightedIndex = -1;
  isSpotifyLoggedIn$: Observable<boolean>;

  // Debounce stream
  private queryInput$ = new Subject<string>();
  private sub: Subscription;

  constructor() {
    this.isSpotifyLoggedIn$ = this.spotifyService.isLoggedIn();

    // Debounce search input: trim + ignore consecutive duplicates + 300ms delay
    this.sub = this.queryInput$
      .pipe(
        map(v => v.replace(/\s+/g, ' ')), // collapse inner whitespace
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => this.completionService.getCompletion(query))
      )
      .subscribe(completions => {
        this.completions = completions;
        this.highlightedIndex = -1;
      });
  }

  onQueryChange(value: string) {
    this.query = value;
    this.queryInput$.next(value);

    if (!value.trim()) {
      this.songService.clearResults();
    }
  }

  performSearch() {
    this.clearCompletions();
    if (!this.query.trim()) {
      return;
    }

    this.loading = true;
    this.songService.getSongs(this.query).subscribe({
      next: (songs) => {
        this.loading = false;
        // The search results component will be updated via a new mechanism
      },
      error: () => {
        this.loading = false;
        this.notifications.error('Search failed.');
      }
    });
  }

  handleAdd(song: Song) {
    this.queueService.addToQueue({ song_url: song.id }).subscribe({
      next: () => {
        this.notifications.success('Song added to queue.');
      },
      error: () => {
        this.notifications.error('Could not add song.');
      }
    });
  }

  clearQuery() {
    this.query = '';
    this.queryInput$.next('');
    this.clearCompletions();
    this.songService.clearResults();
    this.notifications.info('Search cleared', 2500);
  }

  clearCompletions() {
    this.completions = [];
    this.highlightedIndex = -1;
  }

  onKeydown(event: KeyboardEvent) {
    if (this.completions.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedIndex = (this.highlightedIndex + 1) % this.completions.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedIndex = (this.highlightedIndex - 1 + this.completions.length) % this.completions.length;
    } else if (event.key === 'Enter') {
      if (this.highlightedIndex > -1) {
        event.preventDefault();
        this.query = this.completions[this.highlightedIndex];
        this.performSearch();
      }
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
