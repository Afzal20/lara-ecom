<?php

namespace App\Http\Controllers;

use App\Models\ProductModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Response;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = ProductModel::all();

        return Inertia::render('products/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        return Inertia::render('products/Create');
    }

    public function store(Request $request) {
        // Validate the request data
        $validatedData = $request->validate([
            'product_title' => 'required|string|max:255',
            'product_description' => 'required|string',
            'category' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'rating' => 'nullable|numeric|min:0|max:5',
            'stock' => 'nullable|integer|min:0',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'brand' => 'nullable|string|max:255',
            'sku' => 'nullable|string|max:100|unique:products,sku',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|array',
            'dimensions.width' => 'nullable|numeric|min:0',
            'dimensions.height' => 'nullable|numeric|min:0',
            'dimensions.depth' => 'nullable|numeric|min:0',
            'warranty_information' => 'nullable|string|max:500',
            'shipping_information' => 'nullable|string|max:500',
            'availability_status' => 'required|in:In Stock,Out of Stock,Preorder,Discontinued,Low Stock',
            'reviews' => 'nullable|array',
            'reviews.*.user' => 'required_with:reviews|string|max:255',
            'reviews.*.rating' => 'required_with:reviews|numeric|min:0|max:5',
            'reviews.*.comment' => 'required_with:reviews|string|max:1000',
            'return_policy' => 'nullable|string|max:500',
            'minimum_order_quantity' => 'required|integer|min:1',
            'meta' => 'nullable|array',
            'meta.createdAt' => 'nullable|date',
            'meta.updatedAt' => 'nullable|date',
            'meta.barcode' => 'nullable|string|max:100',
            'meta.qrCode' => 'nullable|string|max:100',
            'thumbnail' => 'nullable|url|max:255',
            'images' => 'nullable|array',
            'images.*' => 'url|max:255',
        ]);

        // Process and save the product data to the database
        $product = ProductModel::create($validatedData);

        // Redirect or return response as needed
        return redirect()->route('products.index')->with('success', 'Product created successfully!');
    }

    public function show($id)
    {
        $product = ProductModel::findOrFail($id);
        
        return Inertia::render('products/Show', [
            'product' => $product
        ]);
    }

    public function destroy($id) {
        $product = ProductModel::findOrFail($id);
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Product deleted successfully!');
    }
}
