import { Component, OnInit } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Router, RouterOutlet } from '@angular/router';
import { NgIf ,NgClass} from '@angular/common'; // Import NgIf directive

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf,NgClass],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'budget-frontend';
  showNavbar = true; // Control visibility of navbar
  hideNavbarClass = ''; // Add class to hide navbar
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Listen to route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Hide navbar for /login and /register pages
        if (['/login', '/register'].some(path => event.url.startsWith(path))) {
          this.hideNavbarClass = 'hide-navbar';
        } else {
          this.hideNavbarClass = '';
        }
        console.log('Navigation End URL:', event.url); // Debugging
      }
    });
  }
}