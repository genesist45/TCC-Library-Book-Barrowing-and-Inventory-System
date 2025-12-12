<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookRequest extends Model
{
    protected $fillable = [
        "member_id",
        "catalog_item_id",
        "catalog_item_copy_id",
        "full_name",
        "email",
        "quota",
        "phone",
        "address",
        "return_date",
        "return_time",
        "notes",
        "status",
    ];

    protected $casts = [
        "return_date" => "date",
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function catalogItem()
    {
        return $this->belongsTo(CatalogItem::class);
    }

    public function catalogItemCopy()
    {
        return $this->belongsTo(CatalogItemCopy::class);
    }

    public function bookReturn()
    {
        return $this->hasOne(BookReturn::class);
    }
}
