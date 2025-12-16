<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CatalogItem extends Model
{
    protected $fillable = [
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
        "volume",
        "page_duration",
        "abstract",
        "biblio_info",
        "url_visibility",
        "library_branch",
        "issn",
        "frequency",
        "journal_type",
        "issue_type",
        "issue_period",
        "granting_institution",
        "degree_qualification",
        "supervisor",
        "thesis_date",
        "thesis_period",
        "publication_type",
    ];

    protected $casts = [
        "is_active" => "boolean",
        "thesis_date" => "date",
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

    public function bookRequests(): HasMany
    {
        return $this->hasMany(BookRequest::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(CatalogItemLike::class);
    }

}
