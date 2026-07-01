import { Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SocialPlatform } from '../../../core/models/influencer.model';
import { buildSocialLinks } from '../../utils/social.utils';

@Component({
  selector: 'app-social-icons',
  standalone: true,
  imports: [MatTooltipModule],
  template: `
    <div class="social-icons" [class]="sizeClass">
      @for (link of socialLinks; track link.platform) {
        <div class="social-item">
          <a
            [href]="link.url"
            target="_blank"
            rel="noopener noreferrer"
            [matTooltip]="link.label"
            [attr.aria-label]="link.label"
            (click)="$event.stopPropagation()"
            class="social-icon-btn"
            [style.--social-color]="link.color"
          >
            <i [class]="link.iconClass" aria-hidden="true"></i>
          </a>
          @if (link.followersFormatted) {
            <span class="follower-count">{{ link.followersFormatted }}</span>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .social-icons {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
    }
    .social-icons.gap-sm { gap: 0.5rem 0.75rem; }
    .social-icons.gap-md { gap: 0.75rem 1rem; }
    .social-icons.gap-lg { gap: 1rem 1.25rem; }

    .social-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      min-width: 44px;
    }

    .social-icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      background: #f3f4f6;
      transition: transform 0.2s ease, background-color 0.2s ease;
      width: var(--icon-size, 36px);
      height: var(--icon-size, 36px);
      text-decoration: none;
    }
    .social-icon-btn:hover {
      transform: scale(1.1);
      background-color: color-mix(in srgb, var(--social-color) 18%, #f3f4f6);
    }
    .social-icon-btn i {
      font-size: var(--font-size, 16px);
      color: var(--social-color);
      line-height: 1;
    }

    .follower-count {
      font-size: 0.7rem;
      font-weight: 600;
      color: #6b7280;
      line-height: 1;
    }

    .social-icons.gap-sm .social-icon-btn {
      --icon-size: 32px;
      --font-size: 14px;
    }
    .social-icons.gap-lg .social-icon-btn {
      --icon-size: 42px;
      --font-size: 18px;
    }
    .social-icons.gap-lg .follower-count {
      font-size: 0.75rem;
    }
  `,
})
export class SocialIconsComponent {
  @Input({ required: true }) links!: Partial<Record<SocialPlatform, string>>;
  @Input() followers: Partial<Record<string, number>> = {};
  @Input() followersFormatted: Partial<Record<string, string>> = {};
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get socialLinks() {
    return buildSocialLinks(this.links, this.followers, this.followersFormatted);
  }

  get sizeClass(): string {
    return this.size === 'sm' ? 'gap-sm' : this.size === 'lg' ? 'gap-lg' : 'gap-md';
  }
}
