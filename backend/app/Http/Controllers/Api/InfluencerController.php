<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Influencer\ListInfluencerRequest;
use App\Http\Requests\Influencer\StoreInfluencerRequest;
use App\Http\Requests\Influencer\UpdateInfluencerRequest;
use App\Http\Resources\InfluencerResource;
use App\Http\Responses\ApiResponse;
use App\Models\Influencer;
use App\Services\InfluencerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InfluencerController extends Controller
{
    public function __construct(
        private InfluencerService $service
    ) {}

    public function index(ListInfluencerRequest $request): JsonResponse
    {
        $filters = $request->validated();

        if ($request->user()?->isAdmin()) {
            $filters['admin'] = true;
        }

        $perPage = (int) ($filters['per_page'] ?? 12);
        unset($filters['per_page'], $filters['page']);

        $paginator = $this->service->list($filters, $perPage);

        return ApiResponse::paginated(
            InfluencerResource::collection($paginator),
            'Influencers retrieved successfully.'
        );
    }

    public function show(int $id): JsonResponse
    {
        $influencer = $this->service->getById($id);

        return ApiResponse::success(
            new InfluencerResource($influencer),
            'Influencer retrieved successfully.'
        );
    }

    public function store(StoreInfluencerRequest $request): JsonResponse
    {
        $this->authorize('create', Influencer::class);

        $data = $request->validated();
        $image = $request->file('profile_image');

        $influencer = $this->service->create($data, $image);

        return ApiResponse::success(
            new InfluencerResource($influencer),
            'Influencer created successfully.',
            201
        );
    }

    public function update(UpdateInfluencerRequest $request, int $id): JsonResponse
    {
        $influencer = Influencer::findOrFail($id);
        $this->authorize('update', $influencer);

        $data = $request->validated();
        $image = $request->file('profile_image');

        $influencer = $this->service->update($influencer, $data, $image);

        return ApiResponse::success(
            new InfluencerResource($influencer),
            'Influencer updated successfully.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $influencer = Influencer::findOrFail($id);
        $this->authorize('delete', $influencer);

        $this->service->delete($influencer);

        return ApiResponse::success(null, 'Influencer deleted successfully.');
    }

    public function bulkDestroy(Request $request): JsonResponse
    {
        $this->authorize('create', Influencer::class);

        $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:influencers,id'],
        ]);

        $count = $this->service->bulkDelete($request->input('ids'));

        return ApiResponse::success(
            ['deleted_count' => $count],
            "{$count} influencer(s) deleted successfully."
        );
    }

    public function priceRange(): JsonResponse
    {
        return ApiResponse::success(
            $this->service->getPriceRange(),
            'Price range retrieved successfully.'
        );
    }
}
