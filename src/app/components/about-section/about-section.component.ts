import { Component } from '@angular/core';

@Component({
  selector: 'app-about-section',
  imports: [],
  templateUrl: './about-section.component.html',
})
export class AboutSectionComponent {
  aboutInfo = [
    {
      img: 'icons/mapPoint.svg',
      text: 'Paris, France',
      alt: 'icon de localisation',
    },
    {
      img: 'icons/phone.svg',
      text: '06.51.51.16.19',
      alt: 'icon de telephone',
    },
    {
      img: 'icons/letter.svg',
      text: 'beaumont.thibault@icloud.com',
      alt: 'icon de mail',
    },
  ];
}
