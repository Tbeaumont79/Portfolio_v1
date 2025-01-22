import { Component } from '@angular/core';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [],
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.css',
})
export class AboutSectionComponent {
  aboutInfo = [
    { img: '/icons/mapPoint.svg', text: 'Paris, France' },
    { img: '/icons/phone.svg', text: '06.51.51.16.19' },
    { img: '/icons/letter.svg', text: 'tbeaumont79@icloud.com' },
  ];
}
