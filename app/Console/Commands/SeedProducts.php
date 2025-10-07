<?php

namespace App\Console\Commands;

use App\Models\ProductModel;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class SeedProducts extends Command
{
    protected $signature = 'products:seed {--count=30}';
    protected $description = 'Import products from DummyJSON API';

    public function handle()
    {
        $response = Http::get('https://dummyjson.com/products', [
            'limit' => $this->option('count')
        ]);

        if (!$response->successful()) {
            $this->error('Failed to fetch products from API');
            return 1;
        }

        $products = $response->json()['products'];
        $imported = 0;

        foreach ($products as $product) {
            // Skip if already exists
            if (ProductModel::where('sku', 'API-' . $product['id'])->exists()) {
                continue;
            }

            ProductModel::create([
                'product_title' => $product['title'],
                'product_description' => $product['description'],
                'category' => $product['category'],
                'price' => $product['price'],
                'discount_percentage' => $product['discountPercentage'],
                'rating' => $product['rating'],
                'stock' => $product['stock'],
                'tags' => $product['tags'],
                'brand' => $product['brand'] ?? 'Unknown Brand',
                'sku' => 'API-' . $product['id'],
                'weight' => $product['weight'] ?? rand(1, 10),
                'dimensions' => $product['dimensions'] ?? ['width' => rand(10, 50), 'height' => rand(10, 50), 'depth' => rand(5, 20)],
                'warranty_information' => $product['warrantyInformation'] ?? '1 year warranty',
                'shipping_information' => $product['shippingInformation'] ?? 'Ships in 1-2 business days',
                'availability_status' => $product['stock'] > 0 ? 'In Stock' : 'Out of Stock',
                'reviews' => $product['reviews'],
                'return_policy' => $product['returnPolicy'] ?? '30 days return policy',
                'minimum_order_quantity' => $product['minimumOrderQuantity'] ?? 1,
                'meta' => [
                    'barcode' => $product['meta']['barcode'] ?? 'API-' . $product['id'],
                    'qrCode' => $product['meta']['qrCode'] ?? null
                ],
                'thumbnail' => $product['thumbnail'],
                'images' => $product['images']
            ]);

            $imported++;
        }

        $this->info("Successfully imported {$imported} products");
        return 0;
    }
}