import { SocialPlatform } from '../../core/models/influencer.model';
import { formatFollowers } from './followers.util';

export interface SocialLinkConfig {
  platform: SocialPlatform;
  url: string;
  iconClass: string;
  label: string;
  color: string;
  followers?: number;
  followersFormatted?: string;
}

const PLATFORM_ORDER: SocialPlatform[] = [
  'instagram',
  'tiktok',
  'facebook',
  'youtube',
  'twitter',
  'linkedin',
  'pinterest',
  'snapchat',
  'discord',
  'twitch',
  'website',
];

export const SOCIAL_PLATFORMS: Record<
  SocialPlatform,
  { iconClass: string; label: string; color: string }
> = {
  instagram: { iconClass: 'fa-brands fa-instagram', label: 'Instagram', color: '#E4405F' },
  tiktok: { iconClass: 'fa-brands fa-tiktok', label: 'TikTok', color: '#000000' },
  facebook: { iconClass: 'fa-brands fa-facebook-f', label: 'Facebook', color: '#1877F2' },
  youtube: { iconClass: 'fa-brands fa-youtube', label: 'YouTube', color: '#FF0000' },
  twitter: { iconClass: 'fa-brands fa-x-twitter', label: 'X', color: '#000000' },
  linkedin: { iconClass: 'fa-brands fa-linkedin-in', label: 'LinkedIn', color: '#0A66C2' },
  pinterest: { iconClass: 'fa-brands fa-pinterest-p', label: 'Pinterest', color: '#E60023' },
  snapchat: { iconClass: 'fa-brands fa-snapchat', label: 'Snapchat', color: '#FFFC00' },
  discord: { iconClass: 'fa-brands fa-discord', label: 'Discord', color: '#5865F2' },
  twitch: { iconClass: 'fa-brands fa-twitch', label: 'Twitch', color: '#9146FF' },
  website: { iconClass: 'fa-solid fa-globe', label: 'Website', color: '#6366F1' },
};

export function buildSocialLinks(
  links: Partial<Record<SocialPlatform, string>>,
  followers: Partial<Record<string, number>> = {},
  followersFormatted: Partial<Record<string, string>> = {}
): SocialLinkConfig[] {
  return PLATFORM_ORDER.filter((platform) => !!links[platform]).map((platform) => {
    const config = SOCIAL_PLATFORMS[platform];
    const count = followers[platform];
    return {
      platform,
      url: links[platform]!,
      ...config,
      followers: count,
      followersFormatted: followersFormatted[platform] ?? (count ? formatFollowers(count) : undefined),
    };
  });
}
