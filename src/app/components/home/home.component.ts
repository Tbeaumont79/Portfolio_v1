import { Component } from '@angular/core';
import { BlogListPostComponent } from '../blog-list-post/blog-list-post.component';
import { ProjectSectionComponent } from '../project-section/project-section.component';
import { AboutSectionComponent } from '../about-section/about-section.component';
import { HeroSectionComponent } from '../hero-section/hero-section.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroSectionComponent,
    AboutSectionComponent,
    ProjectSectionComponent,
    BlogListPostComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
