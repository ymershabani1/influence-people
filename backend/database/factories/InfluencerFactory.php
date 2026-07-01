<?php

namespace Database\Factories;

use App\Enums\Gender;
use App\Models\Influencer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Influencer>
 */
class InfluencerFactory extends Factory
{
    private const COUNTRIES = [
        'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
        'France', 'Spain', 'Italy', 'Brazil', 'Mexico', 'Japan', 'South Korea',
        'India', 'Netherlands', 'Sweden', 'Norway', 'UAE', 'Singapore',
    ];

    private const LANGUAGES = [
        'English', 'Spanish', 'French', 'German', 'Portuguese',
        'Italian', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch',
    ];

    private const CURRENCIES = ['EUR'];

    public function definition(): array
    {
        $firstName = fake()->firstName();
        $lastName = fake()->lastName();
        $username = Str()->slug($firstName.$lastName).fake()->numberBetween(1, 999);

        $socialPlatforms = [
            'instagram_url' => 'https://instagram.com/',
            'tiktok_url' => 'https://tiktok.com/@',
            'facebook_url' => 'https://facebook.com/',
            'youtube_url' => 'https://youtube.com/@',
            'twitter_url' => 'https://x.com/',
            'linkedin_url' => 'https://linkedin.com/in/',
            'pinterest_url' => 'https://pinterest.com/',
            'snapchat_url' => 'https://snapchat.com/add/',
            'discord_url' => 'https://discord.gg/',
            'twitch_url' => 'https://twitch.tv/',
            'website_url' => 'https://',
        ];

        $socials = [];
        foreach ($socialPlatforms as $key => $base) {
            if (fake()->boolean(60)) {
                $socials[$key] = $base.$username;
            } else {
                $socials[$key] = null;
            }
        }

        $gender = fake()->randomElement(Gender::cases());
        $numLanguages = fake()->numberBetween(1, 3);

        return array_merge([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'username' => $username,
            'information' => fake()->paragraphs(3, true),
            'gender' => $gender,
            'country' => fake()->randomElement(self::COUNTRIES),
            'contact_phone' => fake()->boolean(75) ? fake()->e164PhoneNumber() : null,
            'contact_email' => fake()->boolean(75) ? fake()->unique()->safeEmail() : null,
            'languages' => fake()->randomElements(self::LANGUAGES, $numLanguages),
            'price' => fake()->randomFloat(2, 50, 50000),
            'currency' => 'EUR',
            'followers_mode' => fake()->randomElement(['manual', 'platforms']),
            'social_followers' => null,
            'followers_count' => fake()->numberBetween(1000, 10000000),
            'profile_image' => null,
            'profile_image_thumbnail' => null,
            'is_featured' => fake()->boolean(20),
            'is_active' => fake()->boolean(90),
        ], $socials);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
