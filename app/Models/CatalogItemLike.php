<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CatalogItemLike extends Model
{
    protected $fillable = [
        'catalog_item_id',
        'session_id',
        'ip_address',
    ];

    /**
     * Get the catalog item that was liked.
     */
    public function catalogItem(): BelongsTo
    {
        return $this->belongsTo(CatalogItem::class);
    }
}
