import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      @for (i of items; track i) {
        <div class="skeleton-card animate-pulse">
          <div class="h-56 bg-gray-200 dark:bg-gray-700 rounded-t-2xl"></div>
          <div class="p-5 space-y-3">
            <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div class="flex gap-2 pt-2">
              @for (j of [1,2,3,4]; track j) {
                <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .skeleton-card {
      @apply bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700;
    }
  `,
})
export class LoadingSkeletonComponent {
  @Input() count = 8;
  get items(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
