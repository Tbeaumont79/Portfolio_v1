import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.component.html',
})
export class HeroSectionComponent {
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
