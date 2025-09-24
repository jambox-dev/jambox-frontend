import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { MockMusicService, Song } from '../core/services/mock-music.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  private service = inject(MockMusicService);

  // Getter pulling latest snapshot (simple mock scenario)
  get results(): Song[] {
    let snapshot: Song[] = [];
    const sub = this.service.searchResults$.subscribe((r: Song[]) => (snapshot = r));
    sub.unsubscribe();
    return snapshot;
  }

  @Output() add = new EventEmitter<Song>();

  onAdd(song: Song) {
    this.add.emit(song);
  }
}
