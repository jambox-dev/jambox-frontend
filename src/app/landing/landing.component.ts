import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 class="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Jambox
      </h1>
      <p class="text-xl mb-8 text-gray-300">The Ultimate Collaborative Music Queue</p>
      
      <div class="space-x-4">
        <a routerLink="/login" class="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold transition-colors">
          Login
        </a>
        <a routerLink="/register" class="px-6 py-3 border border-purple-500 hover:bg-purple-900/30 rounded-full font-semibold transition-colors">
          Get Started
        </a>
      </div>
    </div>
  `,
    styles: []
})
export class LandingComponent { }
