import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from '../models/song.model';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlacklistService {
  private apiUrl = `${environment.apiUrl}/blacklist`;

  constructor(private http: HttpClient) { }

  getBlacklist(): Observable<Song[]> {
    return this.http.get<any[]>(this.apiUrl, { withCredentials: true }).pipe(
      map(songs => songs.map(song => ({
        id: song.songUrl,
        title: song.songName,
        artist: song.author,
        thumbnailUrl: song.songCover,
        songUrl: song.songUrl
      } as Song)))
    );
  }

  blacklistSong(songUrl: string): Observable<any> {
    return this.http.post(this.apiUrl, { song_url: songUrl }, { withCredentials: true });
  }

  unblacklistSong(songUrl: string): Observable<any> {
    return this.http.delete(this.apiUrl, { body: { song_url: songUrl }, withCredentials: true });
  }
}