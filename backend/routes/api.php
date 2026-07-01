<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\InfluencerController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    // Public routes
    Route::get('/influencers', [InfluencerController::class, 'index']);
    Route::get('/influencers/price-range', [InfluencerController::class, 'priceRange']);
    Route::get('/influencers/{id}', [InfluencerController::class, 'show'])->whereNumber('id');

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show'])->whereNumber('id');

    // Auth routes
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware(['auth:sanctum', 'admin'])->group(function (): void {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::post('/influencers', [InfluencerController::class, 'store']);
        Route::match(['put', 'post'], '/influencers/{id}', [InfluencerController::class, 'update'])->whereNumber('id');
        Route::delete('/influencers/{id}', [InfluencerController::class, 'destroy'])->whereNumber('id');
        Route::post('/influencers/bulk-delete', [InfluencerController::class, 'bulkDestroy']);

        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update'])->whereNumber('id');
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->whereNumber('id');
    });
});
