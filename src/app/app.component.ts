import { Component } from '@angular/core';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { AboutSectionComponent } from './components/about-section/about-section.component';
import { ProjectSectionComponent } from './components/project-section/project-section.component';
import { NavbarComponent } from './components/navbar/navbar.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroSectionComponent,
    AboutSectionComponent,
    ProjectSectionComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'portfolio';
}
