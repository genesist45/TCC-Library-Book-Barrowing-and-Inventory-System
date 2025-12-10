<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = [
        'member_no',
        'name',
        'type',
        'borrower_category',
        'status',
        'email',
        'phone',
        'address',
        'booking_quota',
        'member_group',
        'allow_login',
    ];

    protected $casts = [
        'allow_login' => 'boolean',
        'booking_quota' => 'integer',
    ];
}
