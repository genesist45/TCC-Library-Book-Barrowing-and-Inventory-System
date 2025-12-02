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
        $maxFromCopies = self::max('accession_no');
        $maxFromItems = CatalogItem::max('accession_no');

        $maxAccessionNo = max(
            (int) $maxFromCopies ?: 0,
            (int) $maxFromItems ?: 0
        );

        $nextAccessionNo = $maxAccessionNo + 1;

        return str_pad(
            (string) $nextAccessionNo,
            7,
            '0',
            STR_PAD_LEFT
        );
    }

    public static function getNextCopyNo(int $catalogItemId): int
    {
        $lastCopy = self::where('catalog_item_id', $catalogItemId)
            ->orderBy('copy_no', 'desc')
            ->first();

        return $lastCopy ? $lastCopy->copy_no + 1 : 1;
    }
}
