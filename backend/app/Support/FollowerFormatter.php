<?php

namespace App\Support;

class FollowerFormatter
{
    public static function format(int $count): string
    {
        if ($count >= 1_000_000) {
            return round($count / 1_000_000, 1).'M';
        }

        if ($count >= 1_000) {
            return round($count / 1_000, 1).'K';
        }

        return (string) $count;
    }

    /** @param array<string, int|null> $followers */
    public static function formatMany(array $followers): array
    {
        $formatted = [];

        foreach ($followers as $platform => $count) {
            if ($count !== null && $count > 0) {
                $formatted[$platform] = self::format((int) $count);
            }
        }

        return $formatted;
    }

    /** @param array<string, int|null> $followers */
    public static function sum(array $followers): int
    {
        return (int) array_sum(array_map(
            fn ($count) => max(0, (int) ($count ?? 0)),
            $followers
        ));
    }

    public static function platformKeys(): array
    {
        return [
            'instagram', 'tiktok', 'facebook', 'youtube', 'twitter',
            'linkedin', 'pinterest', 'snapchat', 'twitch',
        ];
    }
}
