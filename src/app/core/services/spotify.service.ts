import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
}