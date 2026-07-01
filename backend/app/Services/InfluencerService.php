<?php

namespace App\Services;

use App\Models\Influencer;
use App\Repositories\Contracts\InfluencerRepositoryInterface;
use App\Support\FollowerFormatter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class InfluencerService
{
    public function __construct(
        private InfluencerRepositoryInterface $repository,
        private ImageService $imageService
    ) {}

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->paginate($filters, $perPage);
    }

    public function getById(int $id, bool $publicOnly = true): Influencer
    {
        $influencer = $this->repository->findByIdOrFail($id);

        if ($publicOnly && ! $influencer->is_active) {
            abort(404, 'Influencer not found.');
        }

        return $influencer;
    }

    public function create(array $data, ?UploadedFile $image = null): Influencer
    {
        return DB::transaction(function () use ($data, $image) {
            $categoryIds = $data['category_ids'] ?? [];
            unset($data['category_ids']);

            $data = $this->normalizeFollowersData($data);

            if ($image) {
                $paths = $this->imageService->uploadProfileImage($image);
                $data = array_merge($data, $paths);
            }

            $influencer = $this->repository->create($data);

            if (! empty($categoryIds)) {
                $this->repository->syncCategories($influencer, $categoryIds);
            }

            return $influencer->load('categories');
        });
    }

    public function update(Influencer $influencer, array $data, ?UploadedFile $image = null): Influencer
    {
        return DB::transaction(function () use ($influencer, $data, $image) {
            $categoryIds = $data['category_ids'] ?? null;
            unset($data['category_ids']);

            $data = $this->normalizeFollowersData($data);

            if ($image) {
                $paths = $this->imageService->uploadProfileImage(
                    $image,
                    $influencer->profile_image,
                    $influencer->profile_image_thumbnail
                );
                $data = array_merge($data, $paths);
            }

            $influencer = $this->repository->update($influencer, $data);

            if ($categoryIds !== null) {
                $this->repository->syncCategories($influencer, $categoryIds);
            }

            return $influencer->load('categories');
        });
    }

    public function delete(Influencer $influencer): void
    {
        DB::transaction(function () use ($influencer): void {
            $this->imageService->deleteImages(
                $influencer->profile_image,
                $influencer->profile_image_thumbnail
            );
            $this->repository->delete($influencer);
        });
    }

    public function bulkDelete(array $ids): int
    {
        $influencers = Influencer::whereIn('id', $ids)->get();

        foreach ($influencers as $influencer) {
            $this->imageService->deleteImages(
                $influencer->profile_image,
                $influencer->profile_image_thumbnail
            );
        }

        return $this->repository->bulkDelete($ids);
    }

    public function getStats(): array
    {
        return $this->repository->getStats();
    }

    public function getPriceRange(): array
    {
        return [
            'min' => (float) Influencer::where('is_active', true)->min('price') ?? 0,
            'max' => (float) Influencer::where('is_active', true)->max('price') ?? 10000,
        ];
    }

    private function normalizeFollowersData(array $data): array
    {
        $mode = $data['followers_mode'] ?? 'manual';
        $socialFollowers = $data['social_followers'] ?? [];

        if (is_string($socialFollowers)) {
            $socialFollowers = json_decode($socialFollowers, true) ?? [];
        }

        $cleanSocial = [];
        foreach (FollowerFormatter::platformKeys() as $platform) {
            if (isset($socialFollowers[$platform]) && $socialFollowers[$platform] !== '' && $socialFollowers[$platform] !== null) {
                $cleanSocial[$platform] = max(0, (int) $socialFollowers[$platform]);
            }
        }

        if ($mode === 'platforms') {
            $data['social_followers'] = $cleanSocial;
            $data['followers_count'] = FollowerFormatter::sum($cleanSocial);
        } else {
            $data['social_followers'] = null;
            $data['followers_count'] = max(0, (int) ($data['followers_count'] ?? 0));
        }

        $data['followers_mode'] = $mode;

        return $data;
    }
}
