import { Component } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-project-section',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './project-section.component.html',
  styleUrl: './project-section.component.css',
})
export class ProjectSectionComponent {
  repos: any = [];
  filteredRepo: any = [];
  wantedRepo: string[] = [
    'Portfolio_v1',
    'pix',
    'social-data-api',
    'docker-php-server',
    'Pomodoro',
  ];
  constructor(private githubService: GithubService) {}
  ngOnInit(): void {
    this.githubService.getRepos().subscribe({
      next: (data) => {
        this.repos = data;
        this.filteredRepo = this.repos.filter((repo: any) => {
          return this.wantedRepo.includes(repo.name);
        });
      },
      error: (error) =>
        console.error('Erreur lors du fetch des repos GitHub :', error),
    });
  }
}
