import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex flex-col bg-white text-gray-900 overflow-x-clip">
      <!-- Navbar -->
      <header class="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 border-b border-gray-100">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between gap-3 h-16 min-w-0">
            <a routerLink="/" class="flex items-center gap-2.5 group min-w-0">
              <span
                class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-glow"
              >
                <i class="fa-solid fa-bolt text-white text-sm"></i>
              </span>
              <span class="text-base lg:text-lg font-extrabold tracking-tight whitespace-nowrap">
                Influence<span class="text-primary-600">Elite</span>
              </span>
            </a>

            <div class="desktop-navigation items-center gap-1">
              <a
                routerLink="/"
                routerLinkActive="nav-link-active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="nav-link"
                >Home</a
              >
              <a routerLink="/trending" routerLinkActive="nav-link-active" class="nav-link"
                >Trending</a
              >
              <a routerLink="/search" routerLinkActive="nav-link-active" class="nav-link"
                >Find your Influencer</a
              >
            </div>

            <div class="desktop-navigation items-center gap-2 shrink-0">
              @if (auth.isAdmin()) {
                <a routerLink="/admin" class="nav-link">Admin Panel</a>
              }
              @if (auth.isAuthenticated()) {
                <button type="button" (click)="logout()" class="nav-link">
                  Logout
                </button>
              }
              <a routerLink="/search" class="btn-gradient btn-header" aria-label="Book an Influencer">
                <i class="fa-solid fa-user-plus text-sm" aria-hidden="true"></i>
                <span class="hidden sm:inline">Book an Influencer</span>
              </a>
            </div>

            <button
              type="button"
              class="menu-toggle"
              aria-label="Toggle navigation menu"
              [attr.aria-expanded]="menuOpen()"
              aria-controls="mobile-navigation"
              (click)="toggleMenu()"
            >
              <i
                class="fa-solid text-lg"
                [class.fa-bars]="!menuOpen()"
                [class.fa-xmark]="menuOpen()"
                aria-hidden="true"
              ></i>
            </button>
          </div>

          @if (menuOpen()) {
            <div id="mobile-navigation" class="mobile-menu">
              <a
                routerLink="/"
                routerLinkActive="mobile-link-active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="mobile-link"
                (click)="closeMenu()"
              >
                <i class="fa-solid fa-house" aria-hidden="true"></i>
                Home
              </a>
              <a
                routerLink="/trending"
                routerLinkActive="mobile-link-active"
                class="mobile-link"
                (click)="closeMenu()"
              >
                <i class="fa-solid fa-fire" aria-hidden="true"></i>
                Trending
              </a>
              <a
                routerLink="/search"
                routerLinkActive="mobile-link-active"
                class="mobile-link"
                (click)="closeMenu()"
              >
                <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                Find your Influencer
              </a>

              <div class="mobile-menu-divider"></div>

              @if (auth.isAdmin()) {
                <a routerLink="/admin" class="mobile-link" (click)="closeMenu()">
                  <i class="fa-solid fa-gauge-high" aria-hidden="true"></i>
                  Admin Panel
                </a>
              }
              @if (auth.isAuthenticated()) {
                <button type="button" class="mobile-link w-full" (click)="logout()">
                  <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
                  Logout
                </button>
              }
              <a routerLink="/search" class="mobile-book-btn" (click)="closeMenu()">
                <i class="fa-solid fa-user-plus" aria-hidden="true"></i>
                Book an Influencer
              </a>
            </div>
          }
        </nav>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="mt-24 bg-gray-950 text-gray-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div class="col-span-2 md:col-span-1">
              <a routerLink="/" class="flex items-center gap-2.5">
                <span
                  class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center"
                >
                  <i class="fa-solid fa-bolt text-white text-sm"></i>
                </span>
                <span class="text-lg font-extrabold tracking-tight text-white">
                  Influence<span class="text-primary-400">Elite</span>
                </span>
              </a>
              <p class="mt-4 text-sm text-gray-400 leading-relaxed">
                The world's leading marketplace to discover, connect with, and book top-tier
                creators for your brand.
              </p>
              <div class="mt-5 flex gap-3">
                <a href="#" aria-label="Instagram" class="footer-social"
                  ><i class="fa-brands fa-instagram"></i
                ></a>
                <a href="#" aria-label="X" class="footer-social"
                  ><i class="fa-brands fa-x-twitter"></i
                ></a>
                <a href="#" aria-label="LinkedIn" class="footer-social"
                  ><i class="fa-brands fa-linkedin-in"></i
                ></a>
                <a href="#" aria-label="TikTok" class="footer-social"
                  ><i class="fa-brands fa-tiktok"></i
                ></a>
              </div>
            </div>

            <div>
              <h4 class="footer-title">Platform</h4>
              <ul class="footer-list">
                <li><a routerLink="/search">Browse Influencers</a></li>
                <li><a routerLink="/trending">Trending</a></li>
                <li><a routerLink="/search">Categories</a></li>
                <li><a routerLink="/admin">Admin Portal</a></li>
              </ul>
            </div>

            <div>
              <h4 class="footer-title">Company</h4>
              <ul class="footer-list">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 class="footer-title">Resources</h4>
              <ul class="footer-list">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Guides</a></li>
                <li><a href="#">API</a></li>
              </ul>
            </div>
          </div>

          <div
            class="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <p class="text-sm text-gray-500">
              &copy; {{ year }} InfluenceElite. All rights reserved.
            </p>
            <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" class="hover:text-white transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: `
    .nav-link {
      @apply px-1.5 py-2 lg:px-3 rounded-lg text-xs lg:text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap;
    }
    .nav-link-active {
      @apply text-primary-700 bg-primary-50;
    }
    .btn-gradient {
      @apply inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white whitespace-nowrap;
      @apply bg-gradient-to-r from-primary-600 to-accent-600 shadow-glow;
      @apply hover:shadow-lg hover:-translate-y-0.5 transition-all;
    }
    .btn-header {
      @apply w-10 h-10 p-0 sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:text-xs lg:px-4 lg:text-sm;
    }
    .menu-toggle {
      @apply w-10 h-10 shrink-0 rounded-xl inline-flex items-center justify-center;
      @apply text-gray-700 bg-gray-50 border border-gray-200 hover:text-primary-600 hover:bg-primary-50 transition-colors;
    }
    .desktop-navigation {
      display: none;
    }
    .mobile-menu {
      @apply pb-4 pt-2 border-t border-gray-100 bg-white;
    }
    .mobile-link {
      @apply flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-left;
      @apply text-gray-700 hover:text-primary-700 hover:bg-primary-50 transition-colors;
    }
    .mobile-link i {
      @apply w-5 text-center text-gray-400;
    }
    .mobile-link-active {
      @apply text-primary-700 bg-primary-50;
    }
    .mobile-menu-divider {
      @apply my-2 border-t border-gray-100;
    }
    .mobile-book-btn {
      @apply mt-2 flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl;
      @apply text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 shadow-glow;
    }
    @media (min-width: 769px) {
      .desktop-navigation {
        display: flex;
      }
      .menu-toggle,
      .mobile-menu {
        display: none;
      }
    }
    .footer-title {
      @apply text-sm font-semibold text-white mb-4 uppercase tracking-wide;
    }
    .footer-list {
      @apply space-y-2.5 text-sm;
    }
    .footer-list a {
      @apply text-gray-400 hover:text-white transition-colors;
    }
    .footer-social {
      @apply w-9 h-9 rounded-full bg-white/5 hover:bg-primary-600 flex items-center justify-center text-gray-300 hover:text-white transition-colors;
    }
  `,
})
export class PublicLayoutComponent {
  readonly auth = inject(AuthService);
  readonly year = new Date().getFullYear();
  readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.closeMenu();
    this.auth.logout().subscribe();
  }
}
