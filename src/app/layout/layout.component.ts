import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { NotificationContainerComponent } from '../shared/notification-container/notification-container.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NotificationContainerComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  isDarkMode = false;
  private _isAdminRoute = false;

  constructor(private renderer: Renderer2, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this._isAdminRoute = (event as NavigationEnd).urlAfterRedirects.includes('/admin');
    });
  }

  ngOnInit(): void {
    this.setTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.setTheme();
  }

  private setTheme(): void {
    if (this.isDarkMode) {
      this.renderer.addClass(document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
    }
  }

  isAdminRoute(): boolean {
    return this._isAdminRoute;
  }
}
