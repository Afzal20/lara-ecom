<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OrderItemControllers extends Controller
{
    public function index()
    {
        // Logic to display order items
    }

    public function create(Request $request)
    {
        // Logic to add item to an order
    }

    public function update(Request $request, $id)
    {
        // Logic to update order item details
    }

    public function store(Request $request)
    {
        // Logic to store order item details
    } 

    public function destroy($id)
    {
        // Logic to remove an item from an order
    }
}
