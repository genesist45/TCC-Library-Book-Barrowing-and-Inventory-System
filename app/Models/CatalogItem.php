<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CatalogItem extends Model
{
    protected $fillable = [
        "accession_no",
        "title",
        "type",
        "category_id",
        "publisher_id",
        "isbn",
        "isbn13",
        "call_no",
        "subject",
        "series",
        "edition",
        "year",
        "place_of_publication",
        "extent",
        "other_physical_details",
        "dimensions",
        "url",
        "location",
        "description",
        "cover_image",
        "is_active",
        "status",
    ];

    protected $casts = [
        "is_active" => "boolean",
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function publisher(): BelongsTo
    {
        return $this->belongsTo(Publisher::class);
    }

    public function authors(): BelongsToMany
    {
        return $this->belongsToMany(Author::class, "author_catalog_item");
    }

    public function copies(): HasMany
    {
        return $this->hasMany(CatalogItemCopy::class);
    }

    /**
     * Generate a unique 7-digit accession number
     */
    public static function generateAccessionNo(): string
    {
        do {
            // Generate a random 7-digit number (1000000 to 9999999)
            $accessionNo = str_pad(
                (string) random_int(1000000, 9999999),
                7,
                "0",
                STR_PAD_LEFT,
            );
        } while (self::where("accession_no", $accessionNo)->exists());

        return $accessionNo;
    }

    /**
     * Get the next sequential accession number
     */
    public static function getNextAccessionNo(): string
    {
        $lastItem = self::orderBy("accession_no", "desc")->first();

        if ($lastItem && is_numeric($lastItem->accession_no)) {
            $nextNo = (int) $lastItem->accession_no + 1;
            return str_pad((string) $nextNo, 7, "0", STR_PAD_LEFT);
        }

        // Start from 0000001 if no items exist
        return "0000001";
    }
}
