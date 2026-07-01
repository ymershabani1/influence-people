<?php

namespace App\Http\Resources;

use App\Support\FollowerFormatter;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InfluencerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $socialFollowers = $this->social_followers ?? [];

        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'username' => $this->username,
            'information' => $this->information,
            'gender' => $this->gender?->value,
            'gender_label' => $this->gender?->label(),
            'country' => $this->country,
            'contact_phone' => $this->contact_phone,
            'contact_email' => $this->contact_email,
            'languages' => $this->languages ?? [],
            'price' => (float) $this->price,
            'currency' => $this->currency,
            'followers_count' => $this->followers_count,
            'followers_formatted' => FollowerFormatter::format($this->followers_count),
            'followers_mode' => $this->followers_mode?->value ?? 'manual',
            'social_followers' => $socialFollowers,
            'social_followers_formatted' => FollowerFormatter::formatMany($socialFollowers),
            'profile_image_url' => $this->profile_image_url,
            'profile_image_thumbnail_url' => $this->profile_image_thumbnail_url,
            'social_links' => $this->social_links,
            'instagram_url' => $this->instagram_url,
            'tiktok_url' => $this->tiktok_url,
            'facebook_url' => $this->facebook_url,
            'youtube_url' => $this->youtube_url,
            'twitter_url' => $this->twitter_url,
            'linkedin_url' => $this->linkedin_url,
            'pinterest_url' => $this->pinterest_url,
            'snapchat_url' => $this->snapchat_url,
            'discord_url' => $this->discord_url,
            'twitch_url' => $this->twitch_url,
            'website_url' => $this->website_url,
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
