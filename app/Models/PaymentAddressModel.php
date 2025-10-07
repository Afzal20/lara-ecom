<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentAddressModel extends Model
{
    protected $table = 'payment_address_tables';

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'company',
        'address_1',
        'address_2',
        'city',
        'state',
        'postal_code',
        'country',
        'phone',
        'email',
        'additional_info',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
