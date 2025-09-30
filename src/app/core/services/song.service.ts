import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Song } from '../models/song.model';
import { environment } from '../../../environments/environment';

interface BackendSong {
  id: string;
  songName: string;
  songUrl: string;
  songCover: string;
  author: string;
}

@Injectable({
  providedIn: 'root'
})
export class SongService {

  private apiUrl = `${environment.apiUrl}/songs`;
  private searchResultsSubject = new BehaviorSubject<Song[]>([]);
  public searchResults$ = this.searchResultsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getSongs(songName: string, offset = 0): Observable<Song[]> {
    const params: { song_name: string, offset?: string } = { song_name: songName };
    if (offset > 0) {
      params.offset = String(offset);
    }
    return this.http.get<BackendSong[]>(this.apiUrl, { params: params, withCredentials: true }).pipe(
      map(backendSongs =>
        backendSongs.map(backendSong => ({
          id: backendSong.songUrl,
          title: backendSong.songName,
          artist: backendSong.author,
          thumbnailUrl: backendSong.songCover
        } as Song))
      ),
      tap(songs => {
        if (offset > 0) {
          const currentSongs = this.searchResultsSubject.getValue();
          this.searchResultsSubject.next([...currentSongs, ...songs]);
        } else {
          this.searchResultsSubject.next(songs);
        }
      })
    );
  }

  clearResults() {
    this.searchResultsSubject.next([]);
  }
}