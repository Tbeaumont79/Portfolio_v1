import { Component } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-project-section',
    imports: [DatePipe],
    templateUrl: './project-section.component.html'
})
export class ProjectSectionComponent {
  myObservable: any;
  repos: any = [];
  filteredRepo: any = [];
  wantedRepo: string[] = [
    'Portfolio_v1',
    'docker-php-server',
    'Pomodoro',
    'blog',
  ];
  // appeler l'observable dans le html et faire un pipe async il se demerde pour les fuites de memory
  constructor(private githubService: GithubService) {}
  ngOnInit(): void {
    this.myObservable = this.githubService.getRepos().subscribe({
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
  ngOnDestroy(): void {
    this.myObservable.unsubscribe();
  }
}
