import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private username = 'tbeaumont79';
  private apiUrl = `https://api.github.com/users/${this.username}/repos?per_page=100`;

  constructor(private http: HttpClient) {}

  getRepos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
