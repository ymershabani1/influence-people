<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Influencer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class InfluencerSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();

        if ($categories->isEmpty()) {
            $this->command?->warn('No categories found. Run CategorySeeder first.');

            return;
        }

        Storage::disk('public')->makeDirectory('influencers');
        Storage::disk('public')->makeDirectory('influencers/thumbnails');

        Influencer::factory()
            ->count(100)
            ->create()
            ->each(function (Influencer $influencer) use ($categories): void {
                $influencer->categories()->attach(
                    $categories->random(rand(1, 3))->pluck('id')->toArray()
                );

                $this->assignPlaceholderImage($influencer);
            });
    }

    private function assignPlaceholderImage(Influencer $influencer): void
    {
        try {
            $seed = $influencer->id;
            $response = Http::timeout(10)->get("https://picsum.photos/seed/{$seed}/800/800");

            if (! $response->successful()) {
                return;
            }

            $filename = Str::uuid().'.jpg';
            $path = "influencers/{$filename}";
            $thumbnailPath = "influencers/thumbnails/{$filename}";

            Storage::disk('public')->put($path, $response->body());

            $thumbResponse = Http::timeout(10)->get("https://picsum.photos/seed/{$seed}/300/300");
            if ($thumbResponse->successful()) {
                Storage::disk('public')->put($thumbnailPath, $thumbResponse->body());
            }

            $influencer->update([
                'profile_image' => $path,
                'profile_image_thumbnail' => $thumbResponse->successful() ? $thumbnailPath : $path,
            ]);
        } catch (\Throwable) {
            // Skip image on network failure; influencer still seeded
        }
    }
}
