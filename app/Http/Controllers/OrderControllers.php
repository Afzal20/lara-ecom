<?php

namespace App\Http\Controllers;

use App\Models\OrderModel;
use App\Models\OrderItemModel;
use App\Models\CartModel;
use Illuminate\Http\Request;

class OrderControllers extends Controller
{
    public function index()
    {
        $orders = OrderModel::where('user_id', auth()->id())
            ->with('items.product')
            ->latest()
            ->get();
        
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shipping_address' => 'required|string',
            'billing_address' => 'required|string',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string'
        ]);

        $cartItems = CartModel::where('user_id', auth()->id())->get();
        
        if ($cartItems->isEmpty()) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        $totalAmount = $cartItems->sum(fn($item) => $item->price * $item->quantity);

        $order = OrderModel::create([
            'user_id' => auth()->id(),
            'total_amount' => $totalAmount,
            'shipping_address' => $validated['shipping_address'],
            'billing_address' => $validated['billing_address'],
            'payment_method' => $validated['payment_method'],
            'notes' => $validated['notes'] ?? null,
        ]);

        foreach ($cartItems as $cartItem) {
            OrderItemModel::create([
                'order_id' => $order->id,
                'product_id' => $cartItem->product_id,
                'quantity' => $cartItem->quantity,
                'price' => $cartItem->price,
                'total' => $cartItem->price * $cartItem->quantity,
                'subtotal' => $cartItem->price * $cartItem->quantity,
            ]);
        }

        // Clear cart after order
        CartModel::where('user_id', auth()->id())->delete();

        return response()->json(['success' => true, 'order' => $order->load('items')]);
    }

    public function show($id)
    {
        $order = OrderModel::where('user_id', auth()->id())
            ->with('items.product')
            ->findOrFail($id);
        
        return response()->json($order);
    }
}
