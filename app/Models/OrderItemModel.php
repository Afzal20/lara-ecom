<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItemModel extends Model
{
    protected $table = 'order_item_tables';

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price',
        'total',
        'subtotal',
        'notes',
    ];

    public function order()
    {
        return $this->belongsTo(OrderModel::class);
    }

    public function product()
    {
        return $this->belongsTo(ProductModel::class);
    }
}
