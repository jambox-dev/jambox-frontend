import { Component, computed, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { NotificationContainerComponent } from '../shared/notification-container/notification-container.component';
import { filter } from 'rxjs';
import { ThemeService, Theme } from '../core/services/theme.service';
import { initFlowbite } from 'flowbite';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NotificationContainerComponent, TranslatePipe],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements AfterViewInit {
  private _isAdminRoute = false;
  
  isDarkMode = computed(() => {
    const theme = this.themeService.theme();
    if (theme === Theme.System) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === Theme.Dark;
  });

  constructor(public themeService: ThemeService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this._isAdminRoute = (event as NavigationEnd).urlAfterRedirects.includes('/admin');
    });
  }

  ngAfterViewInit() {
    initFlowbite();
  }

  setTheme(theme: string) {
    this.themeService.setTheme(theme as Theme);
  }

  isAdminRoute(): boolean {
    return this._isAdminRoute;
  }
}
