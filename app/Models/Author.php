<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Author extends Model
{
    protected $fillable = [
        'name',
        'country',
        'bio',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    public function catalogItems(): BelongsToMany
    {
        return $this->belongsToMany(CatalogItem::class, 'author_catalog_item');
    }
}
