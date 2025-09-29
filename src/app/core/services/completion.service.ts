import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompletionService {

  private apiUrl = `${environment.apiUrl}/completion`;

  constructor(private http: HttpClient) { }

  getCompletion(search: string): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl, { params: { search } , withCredentials: true });
  }
}