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
        'reserved_by_member_id',
        'reserved_at',
    ];

    protected $casts = [
        'reserved_at' => 'datetime',
    ];

    public function catalogItem(): BelongsTo
    {
        return $this->belongsTo(CatalogItem::class);
    }

    public function reservedByMember(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Member::class, 'reserved_by_member_id');
    }

    public static function generateAccessionNo(): string
    {
        // Get the maximum accession number from both tables
        $maxFromCopies = self::max('accession_no');
        $maxFromItems = CatalogItem::max('accession_no');

        $maxAccessionNo = max(
            (int) $maxFromCopies ?: 0,
            (int) $maxFromItems ?: 0
        );

        // Start from max + 1 and keep trying until we find a unique one
        $nextAccessionNo = $maxAccessionNo + 1;
        $maxAttempts = 1000; // Prevent infinite loop
        $attempts = 0;

        while ($attempts < $maxAttempts) {
            $candidate = str_pad(
                (string) $nextAccessionNo,
                7,
                '0',
                STR_PAD_LEFT
            );

            // Check if this accession number exists in either table
            $existsInCopies = self::where('accession_no', $candidate)->exists();
            $existsInItems = CatalogItem::where('accession_no', $candidate)->exists();

            if (!$existsInCopies && !$existsInItems) {
                return $candidate;
            }

            $nextAccessionNo++;
            $attempts++;
        }

        // Fallback: use timestamp-based unique number if all else fails
        return str_pad(
            (string) (time() % 10000000),
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
