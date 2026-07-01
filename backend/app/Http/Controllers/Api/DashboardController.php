<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InfluencerResource;
use App\Http\Responses\ApiResponse;
use App\Models\Influencer;
use App\Services\CategoryService;
use App\Services\InfluencerService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(
        private InfluencerService $influencerService,
        private CategoryService $categoryService
    ) {}

    public function index(): JsonResponse
    {
        $stats = $this->influencerService->getStats();
        $categories = $this->categoryService->list();
        $recentInfluencers = Influencer::with('categories')
            ->latest()
            ->limit(5)
            ->get();

        return ApiResponse::success([
            'stats' => $stats,
            'categories_count' => $categories->count(),
            'recent_influencers' => InfluencerResource::collection($recentInfluencers),
        ], 'Dashboard data retrieved successfully.');
    }
}
