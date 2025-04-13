import { Component } from '@angular/core';

@Component({
    selector: 'app-navbar',
    imports: [],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  isOpen = false;
  toggle() {
    this.isOpen = !this.isOpen;
  }
}
