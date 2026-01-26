import { Component } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { DatePipe } from '@angular/common';
import { GithubRepo } from '../../../types/githubRepos';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-section',
  imports: [DatePipe],
  templateUrl: './project-section.component.html',
})
export class ProjectSectionComponent {
  private subscription!: Subscription;
  repos: GithubRepo[] = [];
  filteredRepo: GithubRepo[] = [];
  wantedRepo: string[] = [
    'Portfolio_v1',
    'docker-php-server',
    'Pomodoro',
    'vue-feature-gates',
  ];
  // appeler l'observable dans le html et faire un pipe async il se demerde pour les fuites de memory
  constructor(private githubService: GithubService) {}
  ngOnInit(): void {
    this.subscription = this.githubService.getRepos().subscribe({
      next: (data: GithubRepo[]) => {
        this.repos = data;
        this.filteredRepo = this.repos.filter((repo: GithubRepo) => {
          return this.wantedRepo.includes(repo.name);
        });
      },
      error: (error) =>
        console.error('Erreur lors du fetch des repos GitHub :', error),
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
