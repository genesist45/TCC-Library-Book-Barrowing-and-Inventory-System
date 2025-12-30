<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{
    protected $fillable = [
        'name',
        'address',
        'description',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    /**
     * Get the catalog item copies that belong to this branch.
     */
    public function catalogItemCopies(): HasMany
    {
        return $this->hasMany(CatalogItemCopy::class, 'branch', 'name');
    }
}
