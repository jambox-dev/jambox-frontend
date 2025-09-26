import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private apiUrl = 'http://localhost:8080/spotify';

  constructor(private http: HttpClient) { }

  login(): Observable<any> {
    return this.http.get(`${this.apiUrl}/login`, { observe: 'response' });
  }
}