import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex flex-col bg-white text-gray-900">
      <!-- Navbar -->
      <header class="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-gray-100">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a routerLink="/" class="flex items-center gap-2.5 group">
              <span
                class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-glow"
              >
                <i class="fa-solid fa-bolt text-white text-sm"></i>
              </span>
              <span class="text-lg font-extrabold tracking-tight">
                Influence<span class="text-primary-600">Elite</span>
              </span>
            </a>

            <div class="hidden md:flex items-center gap-1">
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

            <div class="flex items-center gap-2">
              <a routerLink="/admin/login" class="hidden sm:inline-flex nav-link">Admin</a>
              <a routerLink="/search" class="btn-gradient">
                Book an Influencer
              </a>
            </div>
          </div>
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
                <li><a routerLink="/admin/login">Admin Portal</a></li>
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
            <div class="flex gap-6 text-sm text-gray-500">
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
      @apply px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer;
    }
    .nav-link-active {
      @apply text-primary-700 bg-primary-50;
    }
    .btn-gradient {
      @apply inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white;
      @apply bg-gradient-to-r from-primary-600 to-accent-600 shadow-glow;
      @apply hover:shadow-lg hover:-translate-y-0.5 transition-all;
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
  readonly year = new Date().getFullYear();
}
