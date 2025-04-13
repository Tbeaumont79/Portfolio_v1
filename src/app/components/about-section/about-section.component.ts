import { Component } from '@angular/core';

@Component({
    selector: 'app-about-section',
    imports: [],
    templateUrl: './about-section.component.html'
})
export class AboutSectionComponent {
  aboutInfo = [
    { img: '/icons/mapPoint.svg', text: 'Paris, France', alt:'map icon' },
    { img: '/icons/phone.svg', text: '06.51.51.16.19', alt:'phone icon' },
    { img: '/icons/letter.svg', text: 'tbeaumont79@icloud.com', alt:'letter icon' },
  ];
}
