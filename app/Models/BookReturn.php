<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookReturn extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_request_id',
        'member_id',
        'catalog_item_id',
        'return_date',
        'return_time',
        'condition_on_return',
        'remarks',
        'penalty_amount',
        'status',
        'processed_by',
    ];

    protected $casts = [
        'return_date' => 'date',
        'penalty_amount' => 'decimal:2',
    ];

    public function bookRequest()
    {
        return $this->belongsTo(BookRequest::class);
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function catalogItem()
    {
        return $this->belongsTo(CatalogItem::class);
    }

    public function processor()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
