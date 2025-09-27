import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Song } from '../models/song.model';
import { ApprovalQueue, ApproveRequest, QueueAddRequest, QueueSettings } from '../models/queue.model';
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
export class QueueService {

  private apiUrl = `${environment.apiUrl}/queue`;

  constructor(private http: HttpClient) { }

  addToQueue(request: QueueAddRequest): Observable<Song> {
    return this.http.post<Song>(this.apiUrl, request);
  }

  getQueue(): Observable<Song[]> {
    return this.http.get<BackendSong[]>(this.apiUrl.replace('/queue', '/spotify/queue')).pipe(
      map(backendSongs =>
        backendSongs.map(backendSong => ({
          id: backendSong.songUrl,
          title: backendSong.songName,
          artist: backendSong.author,
          thumbnailUrl: backendSong.songCover,
        } as Song))
      )
    );
  }


  searchQueue(songName: string): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/search`, { params: { song_name: songName } });
  }

  getQueueNeedsApproval(): Observable<Song[]> {
    return this.http.get<ApprovalQueue[]>(`${this.apiUrl}/needs-approval`).pipe(
      map(approvalQueue =>
        approvalQueue.map(item => ({
          id: item.id,
          title: item.song.songName,
          artist: item.song.author,
          thumbnailUrl: item.song.songCover
        } as Song))
      )
    );
  }

  searchQueueNeedsApproval(songName: string): Observable<ApprovalQueue[]> {
    return this.http.get<ApprovalQueue[]>(`${this.apiUrl}/needs-approval/search`, { params: { song_name: songName } });
  }

  approveSong(request: ApproveRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/approve`, request);
  }

  getSettings(): Observable<QueueSettings> {
    return this.http.get<QueueSettings>(`${this.apiUrl}/settings`);
  }

  updateSettings(needsApproval: boolean): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/settings?needs-approval=${needsApproval}`, {});
  }
}