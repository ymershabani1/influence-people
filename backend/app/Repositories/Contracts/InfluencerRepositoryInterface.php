<?php

namespace App\Repositories\Contracts;

use App\Models\Influencer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface InfluencerRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?Influencer;

    public function findByIdOrFail(int $id): Influencer;

    public function create(array $data): Influencer;

    public function update(Influencer $influencer, array $data): Influencer;

    public function delete(Influencer $influencer): bool;

    public function bulkDelete(array $ids): int;

    public function syncCategories(Influencer $influencer, array $categoryIds): void;

    public function getStats(): array;
}
