<?php

namespace App\Models;

use App\Enums\FollowersMode;
use App\Enums\Gender;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Influencer extends Model
{
    /** @use HasFactory<\Database\Factories\InfluencerFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'information',
        'gender',
        'country',
        'contact_phone',
        'contact_email',
        'languages',
        'price',
        'currency',
        'followers_count',
        'followers_mode',
        'social_followers',
        'profile_image',
        'profile_image_thumbnail',
        'instagram_url',
        'tiktok_url',
        'facebook_url',
        'youtube_url',
        'twitter_url',
        'linkedin_url',
        'pinterest_url',
        'snapchat_url',
        'discord_url',
        'twitch_url',
        'website_url',
        'is_featured',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'gender' => Gender::class,
            'followers_mode' => FollowersMode::class,
            'social_followers' => 'array',
            'languages' => 'array',
            'price' => 'decimal:2',
            'followers_count' => 'integer',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class)->withTimestamps();
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    public function getProfileImageUrlAttribute(): ?string
    {
        if (! $this->profile_image) {
            return null;
        }

        return Storage::disk('public')->url($this->profile_image);
    }

    public function getProfileImageThumbnailUrlAttribute(): ?string
    {
        $path = $this->profile_image_thumbnail ?? $this->profile_image;

        if (! $path) {
            return null;
        }

        return Storage::disk('public')->url($path);
    }

    public function getSocialLinksAttribute(): array
    {
        $links = [
            'instagram' => $this->instagram_url,
            'tiktok' => $this->tiktok_url,
            'facebook' => $this->facebook_url,
            'youtube' => $this->youtube_url,
            'twitter' => $this->twitter_url,
            'linkedin' => $this->linkedin_url,
            'pinterest' => $this->pinterest_url,
            'snapchat' => $this->snapchat_url,
            'discord' => $this->discord_url,
            'twitch' => $this->twitch_url,
            'website' => $this->website_url,
        ];

        return array_filter($links);
    }
}
