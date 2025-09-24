import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  thumbnailUrl: string;
  durationSec?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MockMusicService {

  private readonly catalog: Song[] = [
    {
      id: '1',
      title: 'Alge',
      artist: 'Krassi',
      album: 'Green Waves',
      thumbnailUrl: 'https://placehold.co/64x64/a7f3d0/166534?text=1',
      durationSec: 192
    },
    {
      id: '2',
      title: 'Forest Echo',
      artist: 'Emerald Drive',
      album: 'Moss',
      thumbnailUrl: 'https://placehold.co/64x64/a7f3d0/166534?text=2',
      durationSec: 210
    },
    {
      id: '3',
      title: 'Neon Stream',
      artist: 'Circuit Grove',
      album: 'Synthetic Leaves',
      thumbnailUrl: 'https://placehold.co/64x64/a7f3d0/166534?text=3',
      durationSec: 205
    },
    {
      id: '4',
      title: 'Midnight Bloom',
      artist: 'Luma Fields',
      album: 'Canopy',
      thumbnailUrl: 'https://placehold.co/64x64/a7f3d0/166534?text=4',
      durationSec: 230
    },
    {
      id: '5',
      title: 'Verdant Pulse',
      artist: 'Deep Root',
      album: 'Subsoil',
      thumbnailUrl: 'https://placehold.co/64x64/a7f3d0/166534?text=5',
      durationSec: 184
    }
  ];

  private readonly queueSubject = new BehaviorSubject<Song[]>([]);
  readonly queue$ = this.queueSubject.asObservable();

  private readonly searchResultsSubject = new BehaviorSubject<Song[]>([]);
  readonly searchResults$ = this.searchResultsSubject.asObservable();

  searchSongs(query: string): Observable<Song[]> {
    if (!query.trim()) {
      this.searchResultsSubject.next([]);
      return of([]);
    }
    const q = query.toLowerCase();
    return of(this.catalog).pipe(
      delay(250),
      map(list =>
        list.filter(
          s =>
            s.title.toLowerCase().includes(q) ||
            s.artist.toLowerCase().includes(q)
        )
      ),
      map(results => {
        this.searchResultsSubject.next(results);
        return results;
      })
    );
  }

  addToQueue(song: Song): void {
    const current = this.queueSubject.getValue();
    if (!current.find(s => s.id === song.id)) {
      this.queueSubject.next([...current, song]);
    }
  }

  removeFromQueue(id: string): void {
    this.queueSubject.next(this.queueSubject.getValue().filter(s => s.id !== id));
  }

  clearQueue(): void {
    this.queueSubject.next([]);
  }

  getSongPosition(id: string): number | null {
    const idx = this.queueSubject.getValue().findIndex(s => s.id === id);
    return idx === -1 ? null : idx + 1;
  }
}