<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_tables', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('product_title');
            $table->text('product_description');
            $table->string('category')->nullable();
            $table->decimal('price', 8, 2);
            $table->decimal('discount_percentage', 8, 2)->nullable();
            $table->decimal('rating', 3, 2)->nullable();
            $table->integer('stock')->nullable();
            $table->json('tags')->nullable();
            $table->string('brand')->nullable();
            $table->string('sku')->nullable();
            $table->decimal('weight', 8, 2)->nullable();
            $table->json('dimensions')->nullable(); // Store as JSON: {width, height, depth}
            $table->string('warranty_information')->nullable();
            $table->string('shipping_information')->nullable();
            $table->enum('availability_status', ['In Stock', 'Out of Stock', 'Preorder', 'Discontinued', 'Low Stock'])->default('In Stock');
            $table->json('reviews')->nullable(); // Store as JSON array of reviews
            $table->string('return_policy')->nullable();
            $table->integer('minimum_order_quantity')->default(1);
            $table->json('meta')->nullable(); // Store as JSON: {createdAt, updatedAt, barcode, qrCode}
            $table->string('thumbnail')->nullable();
            $table->json('images')->nullable(); // Store as JSON array of image URLs
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_tables');
    }
};
