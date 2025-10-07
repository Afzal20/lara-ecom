<?php

namespace App\Http\Controllers;

use App\Models\PaymentAddressModel;
use Illuminate\Http\Request;

class PaymentAddressControllers extends Controller
{
    public function index()
    {
        $addresses = PaymentAddressModel::where('user_id', auth()->id())->get();
        return response()->json($addresses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'address_1' => 'required|string|max:255',
            'address_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|max:255',
            'additional_info' => 'nullable|string'
        ]);

        $address = PaymentAddressModel::create([
            'user_id' => auth()->id(),
            ...$validated
        ]);

        return response()->json(['success' => true, 'address' => $address]);
    }

    public function update(Request $request, $id)
    {
        $address = PaymentAddressModel::where('user_id', auth()->id())->findOrFail($id);
        
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'address_1' => 'required|string|max:255',
            'address_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|max:255',
            'additional_info' => 'nullable|string'
        ]);

        $address->update($validated);
        return response()->json(['success' => true, 'address' => $address]);
    }

    public function destroy($id)
    {
        PaymentAddressModel::where('user_id', auth()->id())->findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}
