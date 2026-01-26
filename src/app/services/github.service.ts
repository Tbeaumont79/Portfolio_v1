import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GithubRepo } from '../../types/githubRepos';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private username = 'tbeaumont79';
  private apiUrl = `https://api.github.com/users/${this.username}/repos?per_page=100`;

  constructor(private http: HttpClient) {}

  getRepos(): Observable<GithubRepo[]> {
    return this.http.get<GithubRepo[]>(this.apiUrl);
  }
}
