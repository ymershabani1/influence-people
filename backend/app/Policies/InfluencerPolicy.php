<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\Influencer;
use App\Models\User;

class InfluencerPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Influencer $influencer): bool
    {
        return $influencer->is_active || ($user && $user->isAdmin());
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Influencer $influencer): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Influencer $influencer): bool
    {
        return $user->isAdmin();
    }
}
