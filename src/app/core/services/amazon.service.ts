import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SongInfo } from './youtube.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AmazonService {
  private apiUrl = `${environment.apiUrl}/amazon`;

  constructor(private http: HttpClient) { }

  isAmazonMusicUrl(url: string): boolean {
    const amazonRegex = /^(https?:\/\/)?(music\.)?amazon\.[a-z\.]{2,6}\/albums\/[A-Z0-9]+/;
    return amazonRegex.test(url);
  }

  getSongInfoFromUrl(url: string): Observable<SongInfo | null> {
    return this.http.get<SongInfo>(`${this.apiUrl}/scrape`, { params: { url } }).pipe(
      catchError(() => of(null))
    );
  }
}