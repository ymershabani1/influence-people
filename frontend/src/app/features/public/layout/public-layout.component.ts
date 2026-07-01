import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatIconModule, MatButtonModule],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <header class="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a routerLink="/" class="flex items-center gap-2 group">
              <div class="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
                <mat-icon class="text-white text-lg">groups</mat-icon>
              </div>
              <span class="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                Influencer Directory
              </span>
            </a>

            <a mat-stroked-button routerLink="/admin/login" class="hidden sm:inline-flex">
              Admin
            </a>
          </div>
        </div>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer class="border-t border-gray-200 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-sm text-gray-500">
              &copy; {{ year }} Influencer Directory. All rights reserved.
            </p>
            <div class="flex gap-6 text-sm text-gray-500">
              <a routerLink="/" class="hover:text-primary-600 transition-colors">Home</a>
              <a routerLink="/admin/login" class="hover:text-primary-600 transition-colors">Admin</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class PublicLayoutComponent {
  readonly year = new Date().getFullYear();
}
