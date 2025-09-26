import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompletionService {

  private apiUrl = 'http://localhost:8080/completion';

  constructor(private http: HttpClient) { }

  getCompletion(search: string): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl, { params: { search } });
  }
}