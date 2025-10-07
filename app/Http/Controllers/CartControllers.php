<?php

namespace App\Http\Controllers;

use App\Models\CartModel;
use Illuminate\Http\Request;

class CartControllers extends Controller
{
    public function index()
    {
        $cartItems = CartModel::where('user_id', auth()->id())
            ->with('product')
            ->get();
        
        return response()->json($cartItems);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:product_tables,id',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0'
        ]);

        $cartItem = CartModel::updateOrCreate(
            ['user_id' => auth()->id(), 'product_id' => $validated['product_id']],
            ['quantity' => $validated['quantity'], 'price' => $validated['price']]
        );

        return response()->json(['success' => true, 'item' => $cartItem]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = CartModel::where('user_id', auth()->id())->findOrFail($id);
        $cartItem->update($validated);

        return response()->json(['success' => true, 'item' => $cartItem]);
    }

    public function destroy($id)
    {
        CartModel::where('user_id', auth()->id())->findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}
