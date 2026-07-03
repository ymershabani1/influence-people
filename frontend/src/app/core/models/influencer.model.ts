export type FollowersMode = 'manual' | 'platforms';

export type Gender = 'male' | 'female' | 'other';

export type SocialPlatform =
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'youtube'
  | 'twitter'
  | 'linkedin'
  | 'pinterest'
  | 'snapchat'
  | 'discord'
  | 'twitch'
  | 'website';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  influencers_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Influencer {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  information?: string;
  gender: Gender;
  gender_label: string;
  country?: string;
  contact_phone?: string;
  contact_email?: string;
  languages: string[];
  price: number;
  currency: string;
  followers_count: number;
  followers_formatted: string;
  bookings_count: number;
  followers_mode?: FollowersMode;
  social_followers?: Partial<Record<string, number>>;
  social_followers_formatted?: Partial<Record<string, string>>;
  profile_image_url?: string;
  profile_image_thumbnail_url?: string;
  social_links: Partial<Record<SocialPlatform, string>>;
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
  is_featured: boolean;
  is_active: boolean;
  categories: Category[];
  created_at?: string;
  updated_at?: string;
}

export interface InfluencerFilters {
  search?: string;
  gender?: Gender;
  min_price?: number;
  max_price?: number;
  category_id?: number;
  sort?: InfluencerSort;
  featured?: boolean;
  is_active?: boolean;
  per_page?: number;
  page?: number;
}

export type InfluencerSort =
  | 'newest'
  | 'oldest'
  | 'lowest_price'
  | 'highest_price'
  | 'most_followers'
  | 'most_booked'
  | 'alphabetical';

export interface PriceRange {
  min: number;
  max: number;
}

export interface DashboardStats {
  total: number;
  active: number;
  featured: number;
  total_followers: number;
}

export interface DashboardData {
  stats: DashboardStats;
  categories_count: number;
  recent_influencers: Influencer[];
}
