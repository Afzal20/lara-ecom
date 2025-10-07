<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartControllers;
use App\Http\Controllers\OrderControllers;
use App\Http\Controllers\PaymentAddressControllers;

Route::get('/', [ProductController::class, 'index'])->name('home');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Cart routes
    Route::get('/cart', [CartControllers::class, 'index']);
    Route::post('/cart', [CartControllers::class, 'store']);
    Route::put('/cart/{id}', [CartControllers::class, 'update']);
    Route::delete('/cart/{id}', [CartControllers::class, 'destroy']);
    
    // Order routes
    Route::get('/orders', [OrderControllers::class, 'index']);
    Route::post('/orders', [OrderControllers::class, 'store']);
    Route::get('/orders/{id}', [OrderControllers::class, 'show']);
    
    // Address routes
    Route::get('/addresses', [PaymentAddressControllers::class, 'index']);
    Route::post('/addresses', [PaymentAddressControllers::class, 'store']);
    Route::put('/addresses/{id}', [PaymentAddressControllers::class, 'update']);
    Route::delete('/addresses/{id}', [PaymentAddressControllers::class, 'destroy']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
