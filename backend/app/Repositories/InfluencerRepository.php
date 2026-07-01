<?php

namespace App\Repositories;

use App\Models\Influencer;
use App\Repositories\Contracts\InfluencerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class InfluencerRepository implements InfluencerRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Influencer::query()->with('categories');

        $this->applyFilters($query, $filters);
        $this->applySorting($query, $filters['sort'] ?? 'newest');

        if (! empty($filters['admin'])) {
            return $query->paginate($perPage);
        }

        return $query->where('is_active', true)->paginate($perPage);
    }

    public function findById(int $id): ?Influencer
    {
        return Influencer::with('categories')->find($id);
    }

    public function findByIdOrFail(int $id): Influencer
    {
        return Influencer::with('categories')->findOrFail($id);
    }

    public function create(array $data): Influencer
    {
        return Influencer::create($data);
    }

    public function update(Influencer $influencer, array $data): Influencer
    {
        $influencer->update($data);

        return $influencer->fresh(['categories']);
    }

    public function delete(Influencer $influencer): bool
    {
        return (bool) $influencer->delete();
    }

    public function bulkDelete(array $ids): int
    {
        return Influencer::whereIn('id', $ids)->delete();
    }

    public function syncCategories(Influencer $influencer, array $categoryIds): void
    {
        $influencer->categories()->sync($categoryIds);
    }

    public function getStats(): array
    {
        return [
            'total' => Influencer::count(),
            'active' => Influencer::where('is_active', true)->count(),
            'featured' => Influencer::where('is_featured', true)->count(),
            'total_followers' => Influencer::sum('followers_count'),
        ];
    }

    private function applyFilters(Builder $query, array $filters): void
    {
        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search): void {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhereHas('categories', function (Builder $cq) use ($search): void {
                        $cq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if (! empty($filters['gender'])) {
            $query->where('gender', $filters['gender']);
        }

        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        if (! empty($filters['category_id'])) {
            $query->whereHas('categories', function (Builder $q) use ($filters): void {
                $q->where('categories.id', $filters['category_id']);
            });
        }

        if (! empty($filters['featured'])) {
            $query->where('is_featured', filter_var($filters['featured'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['is_active']) && $filters['is_active'] !== '') {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }
    }

    private function applySorting(Builder $query, string $sort): void
    {
        match ($sort) {
            'oldest' => $query->orderBy('created_at', 'asc'),
            'lowest_price' => $query->orderBy('price', 'asc'),
            'highest_price' => $query->orderBy('price', 'desc'),
            'most_followers' => $query->orderBy('followers_count', 'desc'),
            'alphabetical' => $query->orderBy('first_name')->orderBy('last_name'),
            default => $query->orderBy('created_at', 'desc'),
        };
    }
}
