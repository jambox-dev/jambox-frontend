import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private apiUrl = `${environment.apiUrl}/spotify`;

  constructor(private http: HttpClient) { }

  login(): Observable<any> {
    return this.http.get(`${this.apiUrl}/login`, { observe: 'response' });
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/loggedin`, { observe: 'response' }).pipe(
      map(response => response.status === 200),
      catchError(() => of(false))
    );
  }
}