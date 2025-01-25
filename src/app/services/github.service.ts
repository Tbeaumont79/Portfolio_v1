import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private username = 'tbeaumont79';
  private apiUrl = `https://api.github.com/users/${this.username}/repos`;

  constructor(private http: HttpClient) {}

  getRepos(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
    });

    return this.http.get(this.apiUrl, { headers });
  }
}
