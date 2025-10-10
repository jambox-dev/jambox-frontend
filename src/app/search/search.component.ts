import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { QueueComponent } from '../queue/queue.component';
import { Song } from '../core/models/song.model';
import { NotificationService } from '../core/services/notification.service';
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  Observable,
  firstValueFrom,
  shareReplay,
  startWith,
  catchError,
  of,
  merge,
  filter,
  tap,
} from 'rxjs';
import { CompletionService } from '../core/services/completion.service';
import { SongService } from '../core/services/song.service';
import { QueueService } from '../core/services/queue.service';
import { SpotifyService } from '../core/services/spotify.service';
import { YoutubeService } from '../core/services/youtube.service';
import { TranslatePipe } from '@ngx-translate/core';
// import { AmazonService } from '../core/services/amazon.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchResultsComponent, QueueComponent, TranslatePipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnDestroy {
  public songService = inject(SongService);
  private queueService = inject(QueueService);
  private completionService = inject(CompletionService);
  private notifications = inject(NotificationService);
  private spotifyService = inject(SpotifyService);
  private youtubeService = inject(YoutubeService);
  // private amazonService = inject(AmazonService);

  // UI state
  query = '';
  loading$: Observable<boolean>;
  offset = 0;
  lastAddedSongId: string | null = null;
  completions: string[] = [];
  highlightedIndex = -1;
  isSpotifyLoggedIn$: Observable<boolean>;

  // Debounce stream
  private queryInput$ = new Subject<string>();
  private search$ = new Subject<void>();
  private loadMore$ = new Subject<void>();
  private sub: Subscription;

  constructor() {
    this.isSpotifyLoggedIn$ = this.spotifyService.isLoggedIn();

    // Debounce search input for completions
    this.sub = this.queryInput$
      .pipe(
        map((v) => v.replace(/\s+/g, ' ')), // collapse inner whitespace
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => this.completionService.getCompletion(query)),
      )
      .subscribe((completions) => {
        this.completions = completions;
        this.highlightedIndex = -1;
      });

    const searchAction$ = this.search$.pipe(map(() => ({ query: this.query.trim(), offset: 0, isSearch: true })));

    const loadMoreAction$ = this.loadMore$.pipe(
      map(() => ({ query: this.query.trim(), offset: this.offset + 10, isSearch: false })),
    );

    const action$ = merge(searchAction$, loadMoreAction$).pipe(
      filter((action) => !!action.query),
      tap((action) => {
        this.offset = action.offset;
        if (action.isSearch) {
          this.clearCompletions();
        }
      }),
      switchMap((action) => {
        const getSongs = (searchQuery: string, offset = 0) =>
          this.songService.getSongs(searchQuery, offset).pipe(
            catchError(() => {
              this.notifications.error('Search failed.');
              return of(null);
            }),
          );

        if (this.youtubeService.isYoutubeUrl(action.query)) {
          return this.youtubeService.getSongInfoFromUrl(action.query).pipe(
            switchMap((songInfo) => {
              if (songInfo) {
                const searchQuery = `${songInfo.artist} - ${songInfo.songTitle}`;
                return getSongs(searchQuery);
              }
              this.notifications.error('Could not parse YouTube URL.');
              return of(null);
            }),
            catchError(() => {
              this.notifications.error('Could not parse YouTube URL.');
              return of(null);
            }),
          );
        } else {
          return getSongs(action.query, action.offset);
        }
      }),
      shareReplay(1),
    );

    this.loading$ = merge(searchAction$.pipe(map(() => true)), loadMoreAction$.pipe(map(() => true)), action$.pipe(map(() => false))).pipe(
      startWith(false),
      distinctUntilChanged(),
      shareReplay(1),
    );

    this.sub.add(action$.subscribe());
  }

  onQueryChange(value: string) {
    this.query = value;
    this.queryInput$.next(value);

    if (!value.trim()) {
      this.songService.clearResults();
    }
  }

  performSearch() {
    this.search$.next();
  }

  loadMore() {
    this.loadMore$.next();
  }

  async handleAdd(song: Song) {
    try {
      await firstValueFrom(this.queueService.addToQueue({ song_url: song.id }));
      this.notifications.success('Song added to queue.');
    } catch (err: any) {
      if (err.error === 'Song is in blacklist') {
        this.notifications.info('This song is in the blacklist.');
      } else {
        this.notifications.error('Could not add song.');
      }
    }
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
