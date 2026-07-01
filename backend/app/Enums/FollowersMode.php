<?php

namespace App\Enums;

enum FollowersMode: string
{
    case Manual = 'manual';
    case Platforms = 'platforms';

    public function label(): string
    {
        return match ($this) {
            self::Manual => 'Total followers (manual)',
            self::Platforms => 'Per platform (auto-sum)',
        };
    }
}
