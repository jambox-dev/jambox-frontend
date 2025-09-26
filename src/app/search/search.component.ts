import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { QueueComponent } from '../queue/queue.component';
import { Song } from '../core/models/song.model';
import { NotificationService } from '../core/services/notification.service';
import { AutoplayService } from '../core/services/autoplay.service';
import { Subject, Subscription, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { CompletionService } from '../core/services/completion.service';
import { SongService } from '../core/services/song.service';
import { QueueService } from '../core/services/queue.service';

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
  private autoplayService = inject(AutoplayService);

  // UI state
  query = '';
  loading = false;
  lastAddedSongId: string | null = null;
  completions: string[] = [];

  // Debounce stream
  private queryInput$ = new Subject<string>();
  private sub: Subscription;

  constructor() {
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
      });
  }

  onQueryChange(value: string) {
    this.query = value;
    this.queryInput$.next(value);
  }

  performSearch() {
    if (!this.query.trim()) {
      // Clear search results
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
    this.completions = [];
    // Clear search results
    this.notifications.info('Search cleared', 2500);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
