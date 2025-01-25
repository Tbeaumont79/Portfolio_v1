import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent {
  isOpen = false;
  socialLinks = [
    {
      img: '/icons/linkedin.svg',
      link: 'https://www.linkedin.com/in/beaumont-thibault/',
      alt: 'linkedin',
    },
    {
      img: '/icons/github.svg',
      link: 'https://github.com/Tbeaumont79',
      alt: 'github',
    },
    {
      img: '/icons/bluesky.svg',
      link: 'https://bsky.app/profile/thibaultb79.bsky.social',
      alt: 'bluesky',
    },
  ];
  toggle() {
    this.isOpen = !this.isOpen;
  }
}
