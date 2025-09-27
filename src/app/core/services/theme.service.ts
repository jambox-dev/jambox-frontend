import { Injectable, signal, effect, Renderer2, RendererFactory2 } from '@angular/core';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
  System = 'system'
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private readonly themeKey = 'theme';

  theme = signal<Theme>(Theme.System);

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadTheme();

    effect(() => {
      const currentTheme = this.theme();
      localStorage.setItem(this.themeKey, currentTheme);
      this.updateTheme(currentTheme);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (this.theme() === Theme.System) {
        this.updateTheme(Theme.System);
      }
    });
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.themeKey) as Theme;
    if (savedTheme && Object.values(Theme).includes(savedTheme)) {
      this.theme.set(savedTheme);
    } else {
      this.theme.set(Theme.System);
    }
  }

  private updateTheme(theme: Theme): void {
    const isDark = theme === Theme.Dark || (theme === Theme.System && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      this.renderer.addClass(document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
    }
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }
}