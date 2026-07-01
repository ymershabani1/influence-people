import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Influencer } from '../../../core/models/influencer.model';
import { SocialIconsComponent } from '../social-icons/social-icons.component';

@Component({
  selector: 'app-influencer-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe, SocialIconsComponent],
  template: `
    <article
      class="influencer-card group cursor-pointer"
      [routerLink]="['/influencers', influencer.id]"
    >
      <div class="relative overflow-hidden rounded-t-2xl">
        <img
          [src]="influencer.profile_image_thumbnail_url || '/assets/placeholder-avatar.svg'"
          [alt]="influencer.full_name"
          class="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        @if (influencer.is_featured) {
          <span class="absolute top-3 left-3 featured-badge">Featured</span>
        }
        <span class="absolute top-3 right-3 gender-badge" [class]="genderClass">
          {{ influencer.gender_label }}
        </span>
      </div>

      <div class="p-5">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ influencer.first_name }}
          <span class="text-gray-600 dark:text-gray-300">{{ influencer.last_name }}</span>
        </h3>

        <div class="flex items-center justify-between mt-2">
          <span class="price-tag">
            {{ influencer.price | number:'1.0-0' }} EUR
          </span>
          <span class="followers-tag">
            <span class="material-icons text-sm">people</span>
            {{ influencer.followers_formatted }}
          </span>
        </div>

        @if (influencer.categories.length) {
          <div class="mt-3 flex flex-wrap gap-1">
            @for (cat of influencer.categories.slice(0, 2); track cat.id) {
              <span class="category-chip">{{ cat.name }}</span>
            }
          </div>
        }

        <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <app-social-icons
            [links]="influencer.social_links"
            [followers]="influencer.social_followers ?? {}"
            [followersFormatted]="influencer.social_followers_formatted ?? {}"
            size="sm"
          />
        </div>
      </div>
    </article>
  `,
  styles: `
    .influencer-card {
      @apply bg-white dark:bg-gray-800 rounded-2xl shadow-card;
      @apply transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1;
      @apply border border-gray-100 dark:border-gray-700;
    }
    .featured-badge {
      @apply px-2 py-1 text-xs font-semibold rounded-full bg-primary-500 text-white;
    }
    .gender-badge { @apply px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm; }
    .gender-male { @apply bg-blue-100/90 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300; }
    .gender-female { @apply bg-pink-100/90 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300; }
    .gender-other { @apply bg-purple-100/90 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300; }
    .price-tag { @apply text-primary-600 dark:text-primary-400 font-bold text-lg; }
    .followers-tag { @apply flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400; }
    .category-chip {
      @apply px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300;
    }
  `,
})
export class InfluencerCardComponent {
  @Input({ required: true }) influencer!: Influencer;

  get genderClass(): string {
    return `gender-${this.influencer.gender}`;
  }
}
