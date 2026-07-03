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
    <article class="influencer-card group">
      <div class="relative overflow-hidden rounded-t-2xl">
        <a [routerLink]="['/influencers', influencer.id]">
          <img
            [src]="influencer.profile_image_thumbnail_url || '/assets/placeholder-avatar.svg'"
            [alt]="influencer.full_name"
            class="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <span
            class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          ></span>
        </a>

        <div class="absolute top-3 left-3 flex gap-2">
          @if (influencer.is_featured) {
            <span class="featured-badge"><i class="fa-solid fa-star text-[10px]"></i> Featured</span>
          }
        </div>

        @if (influencer.bookings_count > 0) {
          <span class="booked-badge">
            <i class="fa-solid fa-fire text-[10px]"></i>
            {{ influencer.bookings_count | number }} booked
          </span>
        }
      </div>

      <div class="p-5">
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-1.5 min-w-0">
            <span class="truncate">{{ influencer.full_name }}</span>
            <i
              class="fa-solid fa-circle-check text-primary-500 text-sm shrink-0"
              title="Verified"
            ></i>
          </h3>
          <span class="gender-badge" [class]="genderClass">{{ influencer.gender_label }}</span>
        </div>

        <p class="text-sm text-gray-500 mt-0.5">&#64;{{ influencer.username }}</p>

        @if (influencer.categories.length) {
          <div class="mt-3 flex flex-wrap gap-1.5">
            @for (cat of influencer.categories.slice(0, 2); track cat.id) {
              <span class="category-chip">{{ cat.name }}</span>
            }
          </div>
        }

        <div class="mt-4 flex items-center justify-between">
          <div>
            <div class="text-xs text-gray-400">Starting at</div>
            <div class="price-tag">{{ influencer.price | number: '1.0-0' }} EUR</div>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-400">Followers</div>
            <div class="text-sm font-semibold text-gray-700 flex items-center gap-1 justify-end">
              <i class="fa-solid fa-user-group text-gray-400 text-xs"></i>
              {{ influencer.followers_formatted }}
            </div>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-100">
          <app-social-icons
            [links]="influencer.social_links"
            [followers]="influencer.social_followers ?? {}"
            [followersFormatted]="influencer.social_followers_formatted ?? {}"
            size="sm"
          />
        </div>

        <a [routerLink]="['/influencers', influencer.id]" class="view-profile-btn">
          View Profile
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </a>
      </div>
    </article>
  `,
  styles: `
    .influencer-card {
      @apply bg-white rounded-2xl shadow-card overflow-hidden;
      @apply transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5;
      @apply border border-gray-100;
    }
    .featured-badge {
      @apply inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-primary-600 text-white shadow;
    }
    .booked-badge {
      @apply absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-white/90 backdrop-blur text-orange-600 shadow;
    }
    .gender-badge {
      @apply px-2 py-0.5 text-xs font-medium rounded-full shrink-0;
    }
    .gender-male {
      @apply bg-blue-100 text-blue-700;
    }
    .gender-female {
      @apply bg-pink-100 text-pink-700;
    }
    .gender-other {
      @apply bg-purple-100 text-purple-700;
    }
    .price-tag {
      @apply text-primary-600 font-extrabold text-lg;
    }
    .category-chip {
      @apply px-2.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 font-medium;
    }
    .view-profile-btn {
      @apply mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold;
      @apply bg-gray-900 text-white hover:bg-primary-600 transition-colors;
    }
  `,
})
export class InfluencerCardComponent {
  @Input({ required: true }) influencer!: Influencer;

  get genderClass(): string {
    return `gender-${this.influencer.gender}`;
  }
}
