<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CatalogItemCopy extends Model
{
    protected $fillable = [
        'catalog_item_id',
        'accession_no',
        'copy_no',
        'branch',
        'location',
        'status',
    ];

    public function catalogItem(): BelongsTo
    {
        return $this->belongsTo(CatalogItem::class);
    }

    public static function generateAccessionNo(): string
    {
        do {
            $accessionNo = str_pad(
                (string) random_int(1000000, 9999999),
                7,
                '0',
                STR_PAD_LEFT
            );
        } while (
            self::where('accession_no', $accessionNo)->exists() ||
            CatalogItem::where('accession_no', $accessionNo)->exists()
        );

        return $accessionNo;
    }

    public static function getNextCopyNo(int $catalogItemId): int
    {
        $lastCopy = self::where('catalog_item_id', $catalogItemId)
            ->orderBy('copy_no', 'desc')
            ->first();

        return $lastCopy ? $lastCopy->copy_no + 1 : 1;
    }
}
