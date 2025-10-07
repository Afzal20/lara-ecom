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
    
    // Cart page and API routes
    Route::get('/cart', function () {
        return Inertia::render('cart/Index');
    })->name('cart.index');
    
    // Cart API routes
    Route::get('/api/cart', [CartControllers::class, 'index'])->name('cart.api.index');
    Route::post('/api/cart', [CartControllers::class, 'store'])->name('cart.api.store');
    Route::put('/api/cart/{id}', [CartControllers::class, 'update'])->name('cart.api.update');
    Route::delete('/api/cart/{id}', [CartControllers::class, 'destroy'])->name('cart.api.destroy');
    
    // Checkout page
    Route::get('/checkout', function () {
        return Inertia::render('checkout/Index');
    })->name('checkout.index');
    
    // Orders page and API routes
    Route::get('/orders', function () {
        return Inertia::render('orders/Index');
    })->name('orders.index');
    Route::get('/api/orders', [OrderControllers::class, 'index'])->name('orders.api.index');
    Route::post('/api/orders', [OrderControllers::class, 'store'])->name('orders.api.store');
    Route::get('/api/orders/{id}', [OrderControllers::class, 'show'])->name('orders.api.show');
    
    // Address API routes
    Route::get('/api/addresses', [PaymentAddressControllers::class, 'index'])->name('addresses.api.index');
    Route::post('/api/addresses', [PaymentAddressControllers::class, 'store'])->name('addresses.api.store');
    Route::put('/api/addresses/{id}', [PaymentAddressControllers::class, 'update'])->name('addresses.api.update');
    Route::delete('/api/addresses/{id}', [PaymentAddressControllers::class, 'destroy'])->name('addresses.api.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
