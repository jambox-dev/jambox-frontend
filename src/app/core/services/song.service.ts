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

  getSongs(songName: string): Observable<Song[]> {
    return this.http.get<BackendSong[]>(this.apiUrl, { params: { song_name: songName } }).pipe(
      map(backendSongs =>
        backendSongs.map(backendSong => ({
          id: backendSong.songUrl,
          title: backendSong.songName,
          artist: backendSong.author,
          thumbnailUrl: backendSong.songCover
        } as Song))
      ),
      tap(songs => this.searchResultsSubject.next(songs))
    );
  }
}