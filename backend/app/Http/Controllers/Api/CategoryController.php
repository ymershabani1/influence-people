<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Responses\ApiResponse;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        private CategoryService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $activeOnly = $request->boolean('active_only', ! $request->user()?->isAdmin());

        if ($request->user()?->isAdmin() && $request->boolean('paginate')) {
            $paginator = $this->service->paginate(
                (int) $request->input('per_page', 15),
                $request->input('search')
            );

            return ApiResponse::paginated(
                CategoryResource::collection($paginator),
                'Categories retrieved successfully.'
            );
        }

        $categories = $this->service->list($activeOnly);

        return ApiResponse::success(
            CategoryResource::collection($categories),
            'Categories retrieved successfully.'
        );
    }

    public function show(int $id): JsonResponse
    {
        $category = $this->service->getById($id);

        return ApiResponse::success(
            new CategoryResource($category),
            'Category retrieved successfully.'
        );
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $this->authorize('create', Category::class);

        $category = $this->service->create($request->validated());

        return ApiResponse::success(
            new CategoryResource($category),
            'Category created successfully.',
            201
        );
    }

    public function update(UpdateCategoryRequest $request, int $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $this->authorize('update', $category);

        $category = $this->service->update($category, $request->validated());

        return ApiResponse::success(
            new CategoryResource($category),
            'Category updated successfully.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $this->authorize('delete', $category);

        $this->service->delete($category);

        return ApiResponse::success(null, 'Category deleted successfully.');
    }
}
