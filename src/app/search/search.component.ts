import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { MockMusicService, Song } from '../core/services/mock-music.service';
import { NotificationService } from '../core/services/notification.service';
import { AutoplayService } from '../core/services/autoplay.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchResultsComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  private service = inject(MockMusicService);
  private notifications = inject(NotificationService);
  private autoplayService = inject(AutoplayService);

  query = '';
  loading = false;
  lastAddedSongId: string | null = null;

  onQueryChange(value: string) {
    // Sanitize input to prevent XSS and limit length
    const sanitized = this.sanitizeInput(value);
    this.query = sanitized;
    
    if (!this.query.trim()) {
      this.clearResults();
      return;
    }
    
    // Limit query length to prevent abuse
    if (this.query.length > environment.limits.maxSearchLength) {
      this.notifications.error(`Search query too long. Maximum ${environment.limits.maxSearchLength} characters allowed.`);
      return;
    }
    
    this.performSearch();
  }

  /**
   * Sanitize user input to prevent XSS attacks
   */
  private sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }
    
    // Remove potentially harmful characters
    return input
      .replace(/[<>&"']/g, '') // Remove basic XSS characters
      .trim()
      .slice(0, environment.limits.maxSearchLength); // Limit length
  }

  private clearResults() {
    this.service.searchSongs('').subscribe();
    this.query = this.query.trim();
  }

  performSearch() {
    this.loading = true;
    this.service.searchSongs(this.query).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Search error:', error);
        this.notifications.error('Search failed. Please try again.');
      }
    });
  }

  handleAdd(song: Song) {
    // Validate song object to prevent errors
    if (!song || !song.id || !song.title) {
      this.notifications.error('Invalid song data.');
      return;
    }

    try {
      const autoplay = this.autoplayService.isEnabled();
      this.service.addToQueue(song);
      this.lastAddedSongId = song.id;

      if (autoplay) {
        const pos = this.service.getSongPosition(song.id);
        this.notifications.success(
          pos && pos > 0
            ? `"${song.title}" added. Position in queue: ${pos}.`
            : `"${song.title}" added to queue.`
        );
      } else {
        this.notifications.success(`"${song.title}" added to queue. Waiting for approval.`);
      }
    } catch (error) {
      console.error('Error adding song to queue:', error);
      this.notifications.error('Could not add song to queue.');
    }
  }

  // Clear search input via X button
  clearQuery() {
    this.query = '';
    this.service.searchSongs('').subscribe();
    this.notifications.info('Search cleared', 2500);
  }
}
