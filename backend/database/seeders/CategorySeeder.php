<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    private const CATEGORIES = [
        'Fashion', 'Fitness', 'Gaming', 'Food', 'Lifestyle', 'Beauty', 'Travel',
        'Technology', 'Business', 'Comedy', 'Music', 'Sports', 'Photography',
        'Cars', 'Pets', 'Education', 'Finance', 'Crypto', 'Health', 'Parenting',
        'Entertainment',
    ];

    public function run(): void
    {
        foreach (self::CATEGORIES as $name) {
            Category::updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'description' => "Influencers in the {$name} niche.",
                    'is_active' => true,
                ]
            );
        }
    }
}
