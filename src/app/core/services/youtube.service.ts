import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface SongInfo {
  songTitle: string;
  artist: string;
}

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  constructor(private http: HttpClient) { }

  isYoutubeUrl(url: string): boolean {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  }

  getSongInfoFromUrl(url: string): Observable<SongInfo | null> {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;

    return this.http.get<any>(oembedUrl).pipe(
      map(videoData => {
        if (!videoData || !videoData.title) {
          return null;
        }

        let songTitle = videoData.title || "";
        let artist = videoData.author_name || "";

        let titleMatch;

        titleMatch = songTitle.match(/^(.*?)\s*-\s*(.*?)(?:\s*[\(\[].*?[\)\]])?(?:\s*feat\..*)?$/i);
        if (titleMatch && titleMatch[1] && titleMatch[2]) {
            artist = titleMatch[1].trim();
            songTitle = titleMatch[2].trim();
        } else {
            titleMatch = songTitle.match(/^(.*?)(?:\s*[\(\[].*?[\)\]])?\s*by\s*(.*?)$/i);
            if (titleMatch && titleMatch[1] && titleMatch[2]) {
                songTitle = titleMatch[1].trim();
                artist = titleMatch[2].trim();
            }
        }

        songTitle = songTitle.replace(/\s*\(Official (Music )?Video\)?/i, '');
        songTitle = songTitle.replace(/\s*\(Official Audio\)?/i, '');
        songTitle = songTitle.replace(/\s*\(Lyric Video\)?/i, '');
        songTitle = songTitle.replace(/\s*\(Visualizer\)?/i, '');
        songTitle = songTitle.replace(/\s*\(Live\)?/i, '');
        songTitle = songTitle.replace(/\s*\(ft\..*?\)/i, '');
        songTitle = songTitle.replace(/\s*\(feat\..*?\)/i, '');
        songTitle = songTitle.replace(/\s*\[.*\].*/i, '');
        songTitle = songTitle.replace(/\s*\|\s*.*?(Music|VEVO|Official)/i, '');
        songTitle = songTitle.replace(/\s+-\s+Topic$/i, '');
        songTitle = songTitle.replace(/\s*video$/i, '');
        songTitle = songTitle.trim();

        artist = artist.replace(/\s*-\s*(Topic|Official Artist Channel|Channel|Offizieller Künstler-Kanal)$/i, '');
        artist = artist.replace(/\s*VEVO$/i, '');
        artist = artist.replace(/\s*Music$/i, '');
        artist = artist.replace(/\s*Official$/i, '');
        artist = artist.replace(/\s*\(.*?\)/g, '');
        artist = artist.replace(/\s*\[.*?\]/g, '');
        artist = artist.trim();

        if (!artist && titleMatch && titleMatch[1]) {
            artist = titleMatch[1].trim();
        }

        return { songTitle, artist };
      }),
      catchError(() => of(null))
    );
  }
}