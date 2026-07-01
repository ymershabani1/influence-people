export type FollowersMode = 'manual' | 'platforms';

export type SocialFollowerPlatform =
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'youtube'
  | 'twitter'
  | 'linkedin'
  | 'pinterest'
  | 'snapchat'
  | 'twitch';

export const SOCIAL_FOLLOWER_PLATFORMS: {
  key: SocialFollowerPlatform;
  label: string;
  urlField: string;
}[] = [
  { key: 'instagram', label: 'Instagram', urlField: 'instagram_url' },
  { key: 'tiktok', label: 'TikTok', urlField: 'tiktok_url' },
  { key: 'facebook', label: 'Facebook', urlField: 'facebook_url' },
  { key: 'youtube', label: 'YouTube', urlField: 'youtube_url' },
  { key: 'twitter', label: 'X (Twitter)', urlField: 'twitter_url' },
  { key: 'linkedin', label: 'LinkedIn', urlField: 'linkedin_url' },
  { key: 'pinterest', label: 'Pinterest', urlField: 'pinterest_url' },
  { key: 'snapchat', label: 'Snapchat', urlField: 'snapchat_url' },
  { key: 'twitch', label: 'Twitch', urlField: 'twitch_url' },
];

export interface InfluencerUrlFields {
  instagram_url?: string;
  tiktok_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  pinterest_url?: string;
  snapchat_url?: string;
  discord_url?: string;
  twitch_url?: string;
  website_url?: string;
}

export function formatFollowers(count: number): string {
  if (count >= 1_000_000) {
    return `${Math.round((count / 1_000_000) * 10) / 10}M`;
  }
  if (count >= 1_000) {
    return `${Math.round((count / 1_000) * 10) / 10}K`;
  }
  return String(count);
}

export function sumSocialFollowers(followers: Partial<Record<SocialFollowerPlatform, number>>): number {
  return Object.values(followers).reduce((sum, n) => sum + (Number(n) || 0), 0);
}
