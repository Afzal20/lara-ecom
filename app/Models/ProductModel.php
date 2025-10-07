<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductModel extends Model
{
    protected $table = 'product_tables';

    protected $fillable = [
        'product_title',
        'product_description',
        'category',
        'price',
        'discount_percentage',
        'rating',
        'stock',
        'tags',
        'brand',
        'sku',
        'weight',
        'dimensions',
        'warranty_information',
        'shipping_information',
        'availability_status',
        'reviews',
        'return_policy',
        'minimum_order_quantity',
        'meta',
        'thumbnail',
        'images',
    ];

    protected $casts = [
        'tags' => 'array',
        'dimensions' => 'array',
        'reviews' => 'array',
        'meta' => 'array',
        'images' => 'array',
    ];
}
