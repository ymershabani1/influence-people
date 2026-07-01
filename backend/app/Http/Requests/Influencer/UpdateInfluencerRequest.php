<?php

namespace App\Http\Requests\Influencer;

use App\Enums\FollowersMode;
use App\Enums\Gender;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInfluencerRequest extends FormRequest
{
    private const URL_FIELDS = [
        'instagram_url', 'tiktok_url', 'facebook_url', 'youtube_url', 'twitter_url',
        'linkedin_url', 'pinterest_url', 'snapchat_url', 'discord_url', 'twitch_url', 'website_url',
    ];

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $merged = [];

        foreach (self::URL_FIELDS as $field) {
            if ($this->has($field) && $this->input($field) === '') {
                $merged[$field] = null;
            }
        }

        if ($this->has('information') && $this->input('information') === '') {
            $merged['information'] = null;
        }

        if ($this->has('country') && $this->input('country') === '') {
            $merged['country'] = null;
        }

        if ($this->has('contact_phone') && $this->input('contact_phone') === '') {
            $merged['contact_phone'] = null;
        }

        if ($this->has('contact_email') && $this->input('contact_email') === '') {
            $merged['contact_email'] = null;
        }

        if (! empty($merged)) {
            $this->merge($merged);
        }
    }

    public function rules(): array
    {
        $influencerId = $this->route('id');

        return [
            'first_name' => ['sometimes', 'required', 'string', 'max:100'],
            'last_name' => ['sometimes', 'required', 'string', 'max:100'],
            'username' => ['sometimes', 'required', 'string', 'max:100', Rule::unique('influencers', 'username')->ignore($influencerId)],
            'information' => ['nullable', 'string', 'max:5000'],
            'gender' => ['sometimes', 'required', Rule::enum(Gender::class)],
            'country' => ['nullable', 'string', 'max:100'],
            'contact_phone' => ['nullable', 'string', 'max:30'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:50'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'required', 'string', Rule::in(['EUR'])],
            'followers_mode' => ['sometimes', 'required', Rule::enum(FollowersMode::class)],
            'followers_count' => ['nullable', 'integer', 'min:0'],
            'social_followers' => ['nullable', 'array'],
            'social_followers.*' => ['nullable', 'integer', 'min:0'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'instagram_url' => ['nullable', 'url', 'max:500'],
            'tiktok_url' => ['nullable', 'url', 'max:500'],
            'facebook_url' => ['nullable', 'url', 'max:500'],
            'youtube_url' => ['nullable', 'url', 'max:500'],
            'twitter_url' => ['nullable', 'url', 'max:500'],
            'linkedin_url' => ['nullable', 'url', 'max:500'],
            'pinterest_url' => ['nullable', 'url', 'max:500'],
            'snapchat_url' => ['nullable', 'url', 'max:500'],
            'discord_url' => ['nullable', 'url', 'max:500'],
            'twitch_url' => ['nullable', 'url', 'max:500'],
            'website_url' => ['nullable', 'url', 'max:500'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
            'profile_image' => ['nullable', 'file', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ];
    }
}
